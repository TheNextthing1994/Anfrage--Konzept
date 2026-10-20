const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const root = path.resolve(__dirname, '..');
  const dist = path.join(root, 'dist');
  const outputDir = process.env.UI_QA_OUTPUT_DIR || path.join(root, 'artifacts', 'process-workspace');
  fs.mkdirSync(outputDir, {recursive:true});
  const launchOptions = {headless:true};
  if (process.env.CHROMIUM_EXECUTABLE) launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE;
  if (process.env.CHROMIUM_ARGS) launchOptions.args = JSON.parse(process.env.CHROMIUM_ARGS);
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
    if (!filename.startsWith(dist) || !fs.existsSync(filename)) { response.writeHead(404); response.end(); return; }
    const type = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'}[path.extname(filename)] || 'application/octet-stream';
    response.writeHead(200, {'Content-Type':type}); response.end(fs.readFileSync(filename));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  // Software-rendered screenshots can take longer than interaction checks.
  page.setDefaultTimeout(30000);
  const errors=[]; const checks=[];
  let mobileBrowser;
  page.on('pageerror',e=>errors.push(e.message));
  const settle=()=>page.waitForTimeout(450);
  const node=id=>page.locator('.react-flow__node[data-id="'+id+'"]');
  const position=id=>node(id).evaluate(e=>e.style.transform);
  const zoom=async()=>parseFloat(await page.locator('.dt-zoom-value').innerText())/100;
  try {
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.dt-process-node').first().waitFor();
    await page.evaluate(()=>document.fonts.ready);
    await settle();
    assert.ok(await zoom()>=0.8);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    checks.push('Readable initial viewport and no horizontal page overflow');

    const assertSingleNavigation=async()=>{
      assert.equal(await page.getByRole('button',{name:/Tabellen-Übersicht|Neues Kundenproblem/}).count(),0);
      assert.equal(await page.getByText('4. Solution Composition',{exact:true}).count(),1);
      assert.equal(await page.getByRole('button',{name:/Neue Anfrage/}).count(),1);
    };
    await assertSingleNavigation();

    // The compact shell must free space without replacing the actual navigation.
    const sidebar=page.getByRole('complementary',{name:'Arbeitsbereichnavigation',exact:true});
    const areaNav=sidebar.getByRole('navigation',{name:'Arbeitsbereiche',exact:true});
    assert.equal(await page.getByText('FOUNDRY FLOW:',{exact:true}).count(),0);
    assert.equal((await sidebar.boundingBox()).width,64);
    const compactWidth=(await page.locator('.dt-workstation-main').boundingBox()).width;
    const graphTransform=await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform);
    const expandSidebar=sidebar.getByRole('button',{name:'Seitenleiste ausklappen',exact:true});
    await expandSidebar.focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('.dt-sidebar').getBoundingClientRect().width===240);
    assert.equal((await sidebar.boundingBox()).width,240);
    assert.equal(await sidebar.getByRole('button',{name:'Seitenleiste einklappen',exact:true}).getAttribute('aria-expanded'),'true');
    assert.equal(compactWidth-(await page.locator('.dt-workstation-main').boundingBox()).width,176);
    assert.equal(await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform),graphTransform,'Expanding navigation must preserve the canvas camera');
    await page.screenshot({path:path.join(outputDir,'navigation-expanded.png'),fullPage:false,timeout:30000});
    checks.push('No demo toolbar; 64px rail expands by keyboard and preserves the canvas camera');

    await page.reload({waitUntil:'domcontentloaded'}); await page.locator('.dt-process-node').first().waitFor(); await settle();
    assert.equal((await sidebar.boundingBox()).width,240);
    const collapseSidebar=sidebar.getByRole('button',{name:'Seitenleiste einklappen',exact:true});
    await collapseSidebar.focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('.dt-sidebar').getBoundingClientRect().width===64);
    assert.equal(await sidebar.getByRole('button',{name:'Seitenleiste ausklappen',exact:true}).evaluate(e=>e===document.activeElement),true);
    await page.reload({waitUntil:'domcontentloaded'}); await page.locator('.dt-process-node').first().waitFor(); await settle();
    assert.equal((await sidebar.boundingBox()).width,64);
    checks.push('Both sidebar widths persist across reload; keyboard focus survives collapsing');

    const areaHeadings=[
      ['Control Plane','Inbox — Neue Inputs'], ['Inbox','Inbox — Neue Inputs'],
      ['Review','Review Queue'], ['Registry','Registry — Bestätigte System-Standards'],
      ['Portfolio','Portfolio / Reopen Trigger Radar'], ['Foundry','Foundry Capabilities'],
      ['Active','Active — Laufende Initiativen & Builds'], ['Settings','Settings'],
      ['Requests','Prozess verstehen']
    ];
    for(const [label,heading] of areaHeadings){
      await areaNav.getByRole('button',{name:label,exact:true}).click();
      await page.getByRole('heading',{name:heading,exact:true}).waitFor();
      assert.equal(await areaNav.getByRole('button',{name:label,exact:true}).getAttribute('aria-current'),'page');
    }
    checks.push('Every workspace remains reachable from the collapsed icon rail');

    const workflow=page.locator('.dt-workstation-main > header');
    await workflow.getByRole('button',{name:'1. Kundenanfrage'}).click();
    await page.getByRole('heading',{name:'Kundenanfragen (Foundry Composition Pool)',exact:true}).waitFor();
    await assertSingleNavigation();
    await page.getByText('Hoffmann Bau GmbH',{exact:true}).first().click();
    await page.getByRole('heading',{name:'Anfrage-Analyse & SaaS-Komposition',exact:true}).waitFor();
    await workflow.getByRole('button',{name:'3. UX Preview'}).click();
    await page.getByRole('heading',{name:'Kundenanfrage annehmen',exact:true}).waitFor();
    await assertSingleNavigation();
    await workflow.getByRole('button',{name:'4. Solution Composition'}).click();
    await page.getByRole('heading',{name:'Anfrage-Analyse & SaaS-Komposition',exact:true}).waitFor();
    await assertSingleNavigation();
    checks.push('Process, preview, analysis and request-list views use one workflow navigation and one intake action');
    await workflow.getByRole('button',{name:'5. Harden & Build'}).click();
    await page.getByRole('heading',{name:'Aktive Initiative',exact:true}).waitFor();
    await workflow.getByRole('button',{name:'6. Portfolio'}).click();
    await page.getByRole('heading',{name:'Portfolio / Reopen Trigger Radar',exact:true}).waitFor();
    await workflow.getByRole('button',{name:'2. Living Process Map'}).click();
    await page.locator('.dt-process-node').first().waitFor(); await settle();
    checks.push('All six workflow destinations and request-to-analysis navigation work without demo shortcuts');

    await sidebar.getByRole('button',{name:'Homepage öffnen',exact:true}).click();
    assert.equal(await page.locator('.dt-workstation-shell').count(),0);
    await page.getByRole('button',{name:'Kostprobe starten',exact:true}).first().click();
    await page.locator('.dt-process-node').first().waitFor(); await settle();
    assert.equal((await sidebar.boundingBox()).width,64);
    checks.push('Homepage and return to the workstation remain available without the removed view-mode toolbar');

    await node('NODE-02').locator('.dt-node-title').click();
    await settle();
    assert.ok((await page.locator('.dt-context-panel').last().innerText()).includes('NODE-02'));
    checks.push('Node selection updates the inspector');

    const before=await position('NODE-02');
    const title=await node('NODE-02').locator('.dt-node-title').boundingBox();
    await page.mouse.move(title.x+title.width/2,title.y+title.height/2);
    await page.mouse.down();
    await page.mouse.move(title.x+title.width/2+42,title.y+title.height/2+38,{steps:12});
    await page.mouse.up(); await settle();
    const moved=await position('NODE-02');
    assert.notEqual(moved,before,'Node drag must change its graph position');
    await page.locator('.dt-filter-button[data-status="INFERRED"]').click();
    await settle();
    assert.equal(await position('NODE-02'),moved,'Filter must preserve dragged position');
    assert.equal(await node('NODE-02').locator('.dt-process-node').evaluate(e=>e.classList.contains('is-dimmed')),true);
    await page.locator('.dt-filter-button[data-status="ALL"]').click();
    await node('NODE-01').locator('.dt-node-title').click(); await settle();
    assert.equal(await position('NODE-02'),moved,'Changing selection must preserve dragged position');
    checks.push('Dragging survives filter and selection changes');

    await page.getByRole('button',{name:'100 %',exact:true}).click(); await settle();
    assert.equal(await zoom(),1);
    await page.getByRole('button',{name:'Gesamtübersicht',exact:true}).click();
    await page.waitForFunction(()=>parseFloat(document.querySelector('.dt-zoom-value').textContent)<80);
    const overviewZoom=await zoom();
    assert.ok(overviewZoom<0.8);
    checks.push('100% reading view and whole-graph overview');

    await page.getByRole('button',{name:'Lasso-Zoom',exact:true}).click();
    const a=await node('NODE-01').boundingBox(), b=await node('NODE-02').boundingBox();
    const stage=await page.locator('.dt-canvas-stage').boundingBox();
    const sx=Math.max(stage.x+3,Math.min(a.x,b.x)-10), sy=Math.max(stage.y+3,Math.min(a.y,b.y)-10);
    const ex=Math.min(stage.x+stage.width-3,Math.max(a.x+a.width,b.x+b.width)+10);
    const ey=Math.min(stage.y+stage.height-3,Math.max(a.y+a.height,b.y+b.height)+10);
    await page.mouse.move(sx,sy); await page.mouse.down(); await page.mouse.move(ex,ey,{steps:20}); await page.mouse.up();
    await settle();
    await page.waitForFunction(start=>parseFloat(document.querySelector('.dt-zoom-value').textContent)/100>start+0.1,overviewZoom);
    assert.ok(await zoom()>overviewZoom+0.1,'Lasso must zoom into selected cards');
    checks.push('Lasso drag zooms into the selected region');
    await page.getByRole('button',{name:'Fertig',exact:true}).click();

    await page.getByRole('button',{name:'Prozessmitte',exact:true}).click(); await settle();
    await page.waitForFunction(()=>parseFloat(document.querySelector('.dt-zoom-value').textContent)>=85);
    assert.ok(await zoom()>=0.85);
    assert.ok((await page.locator('.dt-context-panel').last().innerText()).includes('POLICY'));
    checks.push('Process-center button selects a rule and updates the inspector');

    await page.locator('.dt-context-panel').last().getByRole('button',{name:'Abgeleitet',exact:true}).click(); await settle();
    assert.ok((await page.locator('.dt-process-node.is-selected .dt-status').first().innerText()).includes('Abgeleitet'));
    checks.push('Inspector status changes update the graph');

    await page.getByRole('button',{name:'Knoten',exact:true}).click();
    await page.getByPlaceholder('z.B. Lieferschein abgleichen oder Bauleiter benachrichtigt').fill('QA Prozessprüfung');
    await page.getByRole('button',{name:'Knoten erstellen',exact:true}).click(); await settle();
    assert.equal(await page.locator('.dt-node-title').filter({hasText:'QA Prozessprüfung'}).count(),1);
    checks.push('Adding a node still works');

    const oldCompany=await page.locator('.dt-source-copy').innerText();
    await page.getByTitle('Nächste Anfrage',{exact:true}).click(); await settle();
    assert.notEqual(await page.locator('.dt-source-copy').innerText(),oldCompany);
    assert.equal(await page.locator('.dt-node-title').filter({hasText:'QA Prozessprüfung'}).count(),0);
    assert.notEqual(await page.locator('.react-flow__node').first().getAttribute('data-id'),'NODE-01','A different customer has its own node identities');
    assert.ok(await zoom()>=0.8);
    await page.screenshot({path:path.join(outputDir,'apple-design-hot-state.png'),fullPage:false});
    checks.push('Customer switching resets the appropriate canvas and preserves readable start');

    await page.getByRole('button',{name:'UX-Vorschau öffnen',exact:true}).click(); await settle();
    assert.equal(await page.locator('.dt-process-canvas').count(),0);
    checks.push('Continue to UX Preview still works');

    for(const size of [{width:1440,height:900},{width:390,height:844}]){
      await page.setViewportSize(size);
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.locator('.dt-process-node').first().waitFor(); await settle();
      assert.ok(await zoom()>=0.8);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No page overflow at '+size.width);
      checks.push('Responsive viewport '+size.width+'x'+size.height);
    }
    await page.setViewportSize({width:1920,height:1080});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.dt-process-node').first().waitFor(); await settle();
    await page.screenshot({path:path.join(outputDir,'apple-design-after.png'),fullPage:false});

    // Apple Design: truthful status and a direct path into the review task.
    const progress = page.getByRole('progressbar',{name:'Bestätigte Prozessschritte'});
    const initialConfirmed = Number(await progress.getAttribute('aria-valuenow'));
    assert.equal(initialConfirmed,7);
    assert.equal(await progress.getAttribute('aria-valuemax'),'10');
    await page.getByRole('button',{name:/Offenen Schritt prüfen/}).click(); await settle();
    assert.equal(await page.locator('.dt-inspector-status[data-status="QUESTION"]').getAttribute('aria-pressed'),'true');
    await page.locator('.dt-inspector-status[data-status="CONFIRMED"]').click();
    assert.equal(Number(await progress.getAttribute('aria-valuenow')),initialConfirmed+1);
    checks.push('Review progress reflects confirmed nodes and the review action opens an unresolved step');

    // Anchored, reversible non-modal disclosure with keyboard return.
    const legendTrigger = page.getByRole('button',{name:'Farblegende',exact:true});
    await legendTrigger.click(); await settle();
    const legend = page.getByRole('complementary',{name:'Event-Storming-Farblegende'});
    const legendBox=await legend.boundingBox(), triggerBox=await legendTrigger.boundingBox();
    assert.ok(legendBox.y>=triggerBox.y+triggerBox.height);
    assert.ok(legendBox.x>=0 && legendBox.x+legendBox.width<=1920);
    assert.ok((await legend.innerText()).includes('System'));
    await page.keyboard.press('Escape'); await settle();
    assert.equal(await legend.count(),0);
    assert.equal(await legendTrigger.evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Enter'); await settle();
    await page.getByRole('heading',{name:'Prozess verstehen',exact:true}).click(); await settle();
    assert.equal(await legend.count(),0);
    checks.push('Legend originates at its trigger and supports Escape, keyboard return and outside dismissal');

    const pressTarget=page.getByRole('button',{name:'100 %',exact:true});
    const pressBox=await pressTarget.boundingBox();
    await page.mouse.move(pressBox.x+pressBox.width/2,pressBox.y+pressBox.height/2);
    await page.mouse.down();
    const pressFeedback=await pressTarget.evaluate(e=>({transform:getComputedStyle(e).transform,filter:getComputedStyle(e).filter}));
    assert.notEqual(pressFeedback.transform,'none');
    const blankStage=await page.locator('.dt-canvas-stage').boundingBox();
    await page.mouse.move(blankStage.x+20,blankStage.y+20); await page.mouse.up();
    checks.push('Press feedback appears before release and dragging away cancels the button activation');

    await page.getByRole('button',{name:'Gesamtübersicht',exact:true}).click(); await settle();
    await page.getByRole('button',{name:'Prozessmitte',exact:true}).click();
    const interruptStage=await page.locator('.dt-canvas-stage').boundingBox();
    await page.mouse.move(interruptStage.x+36,interruptStage.y+48); await page.mouse.down();
    await page.mouse.move(interruptStage.x+116,interruptStage.y+65,{steps:4}); await page.mouse.up();
    await page.waitForTimeout(20);
    const interrupted=await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform);
    await settle();
    assert.equal(await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform),interrupted,'Manual input must interrupt programmatic viewport motion');
    checks.push('A manual pan interrupts the camera transition without a later snap-back');

    // Sample live rendered frames, including a preference toggle without reload.
    const frameSamples=()=>page.evaluate(()=>new Promise(resolve=>{
      const button=[...document.querySelectorAll('button')].find(e=>e.getAttribute('aria-label')==='Gesamtübersicht');
      const samples=[]; button.click();
      const sample=()=>{samples.push(document.querySelector('.react-flow__viewport').style.transform);if(samples.length<5)requestAnimationFrame(sample);else resolve(samples);};
      requestAnimationFrame(sample);
    }));
    const offscreenStage=await page.locator('.dt-canvas-stage').boundingBox();
    await page.mouse.move(offscreenStage.x+35,offscreenStage.y+45); await page.mouse.down();
    await page.mouse.move(offscreenStage.x+555,offscreenStage.y+45,{steps:8}); await page.mouse.up(); await settle();
    const manualPosition=await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform);
    await page.emulateMedia({reducedMotion:'reduce'}); await settle();
    assert.equal(await page.locator('.react-flow__viewport').evaluate(e=>e.style.transform),manualPosition,'OS preference changes must not recenter an off-screen selection');
    checks.push('Changing the OS motion preference preserves the manually chosen canvas position');
    const reducedFrames=await frameSamples();
    assert.ok(reducedFrames.every(frame=>frame===reducedFrames[0] || frame===reducedFrames.at(-1)),'Reduced motion must snap directly, allowing the normal one-frame render boundary: '+JSON.stringify(reducedFrames));
    await page.getByRole('button',{name:'Prozessmitte',exact:true}).click(); await settle();
    await page.emulateMedia({reducedMotion:'no-preference'}); await settle();
    const normalFrames=await frameSamples();
    assert.ok(new Set(normalFrames).size>2,'Motion preference changes must take effect without reload: '+JSON.stringify(normalFrames));
    await settle();
    checks.push('Live reduced-motion changes disable camera animation; normal motion resumes without reload');

    await page.emulateMedia({contrast:'more'}); await settle();
    const contrastStyle=await page.locator('.dt-context-panel').first().evaluate(e=>({background:getComputedStyle(e).backgroundColor,image:getComputedStyle(e).backgroundImage,border:getComputedStyle(e).borderTopColor}));
    assert.equal(contrastStyle.image,'none');
    assert.equal(contrastStyle.background,'rgb(16, 34, 57)');
    assert.equal(contrastStyle.border,'rgb(165, 189, 217)');
    checks.push('Higher-contrast preference supplies solid surfaces and defined borders');
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});
    await settle();
    assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-transparency: reduce)').matches),true);
    const reducedMaterial=await page.locator('.dt-process-node').first().evaluate(e=>({image:getComputedStyle(e).backgroundImage,blur:getComputedStyle(e).backdropFilter}));
    assert.equal(reducedMaterial.image,'none'); assert.equal(reducedMaterial.blur,'none');
    checks.push('Reduced-transparency preference removes blur and uses an opaque material');

    await cdp.send('Emulation.setEmulatedMedia',{features:[]});
    await page.emulateMedia({reducedMotion:'no-preference',contrast:'no-preference'});
    await page.reload({waitUntil:'domcontentloaded'}); await page.locator('.dt-process-node').first().waitFor(); await settle();
    await page.getByRole('button',{name:'Prozess aus Kundenwunsch ableiten',exact:true}).click();
    await page.locator('[role="status"]').filter({hasText:/Systeme abgeleitet/}).waitFor();
    checks.push('Local process derivation provides completion feedback without a simulated loading state');

    mobileBrowser=await chromium.launch(launchOptions);
    const mobile=await mobileBrowser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    mobile.on('pageerror',e=>errors.push(e.message));
    await mobile.goto(base,{waitUntil:'domcontentloaded'}); await mobile.locator('.dt-process-node').first().waitFor();
    const touchButtons=await mobile.locator('.dt-canvas-toolbar button,.dt-inspector-status').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
    assert.ok(touchButtons.every(b=>b.w>=44 && b.h>=44),'Touch controls must have at least a 44px target');
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await mobile.getByRole('button',{name:'Farblegende',exact:true}).tap(); await mobile.waitForTimeout(300);
    const mobileLegend=await mobile.locator('.dt-canvas-legend').boundingBox();
    assert.ok(mobileLegend.x>=0 && mobileLegend.x+mobileLegend.width<=390);
    await mobile.screenshot({path:path.join(outputDir,'apple-design-mobile.png'),fullPage:false});
    const mobileSidebar=mobile.getByRole('complementary',{name:'Arbeitsbereichnavigation',exact:true});
    assert.equal((await mobileSidebar.boundingBox()).height,57);
    assert.equal(await mobileSidebar.getByRole('navigation',{name:'Arbeitsbereiche',exact:true}).isVisible(),false);
    await mobile.getByRole('button',{name:'Arbeitsbereiche öffnen',exact:true}).tap();
    assert.equal(await mobileSidebar.getByRole('navigation',{name:'Arbeitsbereiche',exact:true}).isVisible(),true);
    const mobileTargets=await mobileSidebar.locator('button:visible').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));
    assert.ok(mobileTargets.every(h=>h>=44));
    await mobile.screenshot({path:path.join(outputDir,'navigation-mobile-open.png'),fullPage:false});
    await mobileSidebar.getByRole('button',{name:'Settings',exact:true}).tap();
    await mobile.getByRole('heading',{name:'Settings',exact:true}).waitFor();
    assert.equal(await mobileSidebar.getByRole('navigation',{name:'Arbeitsbereiche',exact:true}).isVisible(),false);
    await mobile.getByRole('button',{name:'Arbeitsbereiche öffnen',exact:true}).tap();
    await mobile.keyboard.press('Escape');
    assert.equal(await mobileSidebar.getByRole('navigation',{name:'Arbeitsbereiche',exact:true}).isVisible(),false);
    assert.equal(await mobile.getByRole('button',{name:'Arbeitsbereiche öffnen',exact:true}).evaluate(e=>e===document.activeElement),true);
    checks.push('Mobile navigation uses one compact row, closes after selection and supports Escape with focus return');
    await mobileBrowser.close();
    checks.push('Touch controls meet 44px sizing and the mobile legend stays within the viewport');

    await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});
    await page.reload({waitUntil:'domcontentloaded'}); await page.locator('.dt-process-node').first().waitFor(); await settle();
    await page.screenshot({path:path.join(outputDir,'apple-design-after.png'),fullPage:false});
    await legendTrigger.click(); await settle();
    await page.locator('.dt-canvas-legend').screenshot({path:path.join(outputDir,'apple-design-legend.png')});

    assert.deepEqual(errors,[]);
    const report={passed:checks.length,checks,runtimeErrors:errors,browser:browser.version(),viewports:['1920x1080','1440x900','390x844'],timestamp:new Date().toISOString()}; fs.writeFileSync(path.join(outputDir,'apple-design-qa.json'),JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2));
  } catch(error) {
    console.error(JSON.stringify({passedBeforeFailure:checks.length,checks})); console.error(error);
    await page.screenshot({path:path.join(outputDir,'apple-design-failure.png'),fullPage:false}).catch(e=>console.error('Failure screenshot: '+e.message)); process.exitCode=1;
  } finally {
    await mobileBrowser?.close();
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exit(1);});
