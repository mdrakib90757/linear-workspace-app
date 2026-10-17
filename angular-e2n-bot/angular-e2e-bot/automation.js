const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Helper functions
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log("⚡ ===========================================================");
  console.log("🚀 Linear Workspace Full-Feature Deep Automation Bot Starting...");
  console.log("🎯 Features: Dynamic sidebar drag/peek, Full agent chat & action pills,");
  console.log("           Issue management, Command palette, and human mouse simulation!");
  console.log("🛑 To stop, press Ctrl + C in the terminal.");
  console.log("=============================================================\n");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const targetUrl = 'http://localhost:4200';

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);

  // Smooth human mouse movement and click
  async function humanClick(box) {
    if (!box) return;
    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;
    await page.mouse.move(targetX, targetY, { steps: randomBetween(10, 18) });
    await sleep(randomBetween(150, 300));
    await page.mouse.down();
    await sleep(randomBetween(60, 120));
    await page.mouse.up();
  }

  // 1. Dynamic sidebar dragging, resizing, and peeking (Sidebar Drag & Peek)
  async function testSidebarDynamicResizeAndPeek() {
    console.log("\n📐 [Sidebar] Testing dynamic sidebar drag and resize...");
    try {
      const gutter = await page.$('.resize-gutter');
      if (gutter) {
        const box = await gutter.boundingBox();
        if (box) {
          // Hover over gutter to view tooltip
          await page.mouse.move(box.x + box.width / 2, box.y + 200, { steps: 12 });
          console.log("   👀 Hovered over gutter (inspecting 'Drag to resize' tooltip)");
          await sleep(1000);

          // Click and drag to expand sidebar
          await page.mouse.down();
          await page.mouse.move(box.x + 80, box.y + 200, { steps: 20 });
          await sleep(400);
          await page.mouse.up();
          console.log("   ↔️ Dragged sidebar to the right (+80px)");
          await sleep(800);

          // Drag sidebar back to normal position
          await page.mouse.down();
          await page.mouse.move(box.x, box.y + 200, { steps: 15 });
          await sleep(300);
          await page.mouse.up();
          console.log("   ↔️ Reset sidebar back to default width");
          await sleep(800);
        }
      }

      // Test sidebar collapse using '[' shortcut
      console.log("   🗄️ Collapsing sidebar (pressing '[')...");
      await page.keyboard.press('[');
      await sleep(1500);

      // When sidebar is collapsed, test 'Peek' on hover
      const toggleBtn = await page.$('.sidebar-toggle-btn');
      if (toggleBtn) {
        const tBox = await toggleBtn.boundingBox();
        if (tBox) {
          console.log("   🔍 Hovering over collapsed toggle to trigger 'Peek'...");
          await page.mouse.move(tBox.x + tBox.width / 2, tBox.y + tBox.height / 2, { steps: 10 });
          await sleep(2000); // Keep sidebar peeking
          await page.mouse.move(500, 300, { steps: 10 }); // Move away to unpeek
          await sleep(1000);

          // Click toggle button to fully open sidebar
          console.log("   🔓 Clicked toggle button to reopen sidebar");
          await humanClick(tBox);
          await sleep(1500);
        }
      } else {
        // If toggle button not found, press '[' again
        await page.keyboard.press('[');
        await sleep(1000);
      }
    } catch (err) {
      console.log(`   ⚠️ Sidebar test skipped: ${err.message}`);
    }
  }

  // 2. Comprehensive Agent view test (Agent Prompts, Skills, Examples & Action Pills)
  async function testAgentViewDeeply() {
    console.log("\n🤖 [Agent View] Starting deep interaction in Agent view...");
    try {
      // Navigate to Agent view
      const agentNav = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.linear-sidebar .nav-item, .linear-sidebar button, .agent-pill-btn'));
        for (const b of btns) {
          if (b.innerText && b.innerText.includes('Agent')) {
            const rect = b.getBoundingClientRect();
            return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
          }
        }
        return null;
      });

      if (agentNav) {
        await humanClick(agentNav);
        await sleep(2000);
      }

      // Step 1: Open Skills dropdown and select a skill
      console.log("   ✨ Opening Skills menu and selecting a skill...");
      const skillsBtn = await page.$('.skills-btn');
      if (skillsBtn) {
        const box = await skillsBtn.boundingBox();
        await humanClick(box);
        await sleep(1000);

        // Click a random skill item
        const skillItems = await page.$$('.skill-item');
        if (skillItems.length > 0) {
          const randomSkill = skillItems[randomBetween(0, skillItems.length - 1)];
          const sBox = await randomSkill.boundingBox();
          await humanClick(sBox);
          console.log("   ✅ Skill selected successfully");
          await sleep(1000);
        }
      }

      // Step 2: Option A — Click Example Card (e.g., Create a new project)
      const exampleCards = await page.$$('.examples-grid .example-card');
      if (exampleCards.length > 0 && Math.random() > 0.4) {
        const cardIndex = randomBetween(0, exampleCards.length - 1);
        const card = exampleCards[cardIndex];
        const cardTitle = await page.evaluate(el => el.querySelector('.card-title')?.innerText || 'Example', card);
        console.log(`   💡 Clicking Agent example card: "${cardTitle}"`);
        const cBox = await card.boundingBox();
        await humanClick(cBox);
        await sleep(2000);
      } else {
        // Option B — Type prompt directly into textarea and send
        console.log("   ✍️ Typing prompt into textarea...");
        const textarea = await page.$('.prompt-textarea');
        if (textarea) {
          const tBox = await textarea.boundingBox();
          await humanClick(tBox);
          await sleep(400);

          const prompts = [
            "Create a new priority roadmap for our upcoming release",
            "Research highest priority open bugs in Linear backlog",
            "Set up a design sprint workflow for user feedback"
          ];
          const chosenPrompt = prompts[randomBetween(0, prompts.length - 1)];
          await page.keyboard.type(chosenPrompt, { delay: randomBetween(40, 80) });
          await sleep(600);

          // Click send button or press Enter
          const sendBtn = await page.$('.send-btn');
          if (sendBtn) {
            const sBox = await sendBtn.boundingBox();
            await humanClick(sBox);
          } else {
            await page.keyboard.press('Enter');
          }
          console.log(`   🚀 Prompt sent: "${chosenPrompt}"`);
          await sleep(1500);
        }
      }

      // Step 3: Wait for Agent 'Thinking' animation and response
      console.log("   ⏳ Agent processing (Thinking animation)...");
      await sleep(2000);

      // Step 4: Click generated Action Pills (e.g. 'Create issue from prompt')
      console.log("   💊 Looking for Agent action pills...");
      const actionPills = await page.$$('.action-pill');
      if (actionPills.length > 0) {
        const pill = actionPills[randomBetween(0, actionPills.length - 1)];
        const pillText = await page.evaluate(el => el.innerText, pill);
        console.log(`   🎯 Clicked Agent action pill: "${pillText}"`);
        const pBox = await pill.boundingBox();
        await humanClick(pBox);
        await sleep(2000);

        // If 'Create issue' modal opens
        const modal = await page.$('.modal-overlay, .new-issue-modal, app-new-issue-modal');
        if (modal) {
          console.log("   📝 New issue modal opened from action pill! Entering details...");
          await page.keyboard.type(' - Auto generated task from agent', { delay: 60 });
          await sleep(1000);
          await page.keyboard.press('Escape');
          console.log("   ❎ Closed modal");
          await sleep(800);
        }
      }

      // Step 5: Test New Chat menu
      console.log("   💬 Testing New Chat dropdown menu...");
      const newChatBtn = await page.$('.new-chat-dropdown-btn');
      if (newChatBtn) {
        const ncBox = await newChatBtn.boundingBox();
        await humanClick(ncBox);
        await sleep(800);
        const chatMenuItems = await page.$$('.chat-menu-item');
        if (chatMenuItems.length > 0) {
          const itemBox = await chatMenuItems[0].boundingBox();
          await humanClick(itemBox);
          console.log("   ✨ Started new chat successfully");
          await sleep(1000);
        }
      }

    } catch (err) {
      console.log(`   ⚠️ Agent view test error: ${err.message}`);
    }
  }

  // 3. Deep interaction with Issues & Inbox (Issues, Notifications, Detail Panel)
  async function testIssuesAndInbox() {
    console.log("\n📋 [Issues & Inbox] Interacting with Issues & Inbox sections...");
    try {
      // Ensure sidebar is open
      await page.keyboard.press('[');
      await sleep(500);

      const navTarget = Math.random() > 0.5 ? 'My issues' : 'Inbox';
      await page.evaluate((name) => {
        const btns = Array.from(document.querySelectorAll('.linear-sidebar .nav-item'));
        for (const b of btns) {
          if (b.innerText && b.innerText.includes(name)) {
            b.click();
            break;
          }
        }
      }, navTarget);
      await sleep(2000);

      // Click issue cards to open right-side Detail Panel
      const issueCards = await page.$$('app-issue-card, .list-content > div, .notification-card');
      if (issueCards.length > 0) {
        const count = Math.min(issueCards.length, 3);
        console.log(`   🏷️ Found ${issueCards.length} items. Opening ${count} items...`);
        for (let i = 0; i < count; i++) {
          const cards = await page.$$('app-issue-card, .list-content > div, .notification-card');
          if (cards[i]) {
            const cBox = await cards[i].boundingBox();
            await humanClick(cBox);
            console.log(`      🔹 Clicked item #${i + 1}`);
            await sleep(1200);

            // Scroll inside Detail Panel
            await page.evaluate(() => {
              const detail = document.querySelector('.detail-section, .detail-panel-wrapper');
              if (detail) detail.scrollBy({ top: 150, behavior: 'smooth' });
            });
            await sleep(600);
          }
        }
      }

      // Smooth mouse wheel scrolling in content area
      await page.mouse.move(600, 400);
      await page.mouse.wheel({ deltaY: 350 });
      await sleep(600);
      await page.mouse.wheel({ deltaY: -350 });
      await sleep(800);

    } catch (err) {
      console.log(`   ⚠️ Issues & Inbox test error: ${err.message}`);
    }
  }

  // 4. Command Palette & Global Search Shortcuts (Command Palette & Shortcuts)
  async function testGlobalSearchAndModals() {
    console.log("\n⚡ [Modals] Testing Command Palette and shortcuts...");
    try {
      // Open Command Palette with Ctrl+K
      console.log("   ⌨️ Pressing 'Ctrl+K' to open Command Palette...");
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyK');
      await page.keyboard.up('Control');
      await sleep(1200);

      // Type search query in Command Palette
      await page.keyboard.type('Linear design', { delay: 70 });
      await sleep(1000);
      await page.keyboard.press('ArrowDown');
      await sleep(400);
      await page.keyboard.press('Escape');
      console.log("   ✅ Command Palette successfully tested and closed");
      await sleep(800);

      // Press 'C' key to test New Issue Modal
      console.log("   ⌨️ Pressing 'C' key to test New Issue Modal...");
      await page.keyboard.press('KeyC');
      await sleep(1200);
      await page.keyboard.type('Test Issue from bot runner', { delay: 60 });
      await sleep(800);
      await page.keyboard.press('Escape');
      console.log("   ✅ New Issue Modal test completed");
      await sleep(800);

    } catch (err) {
      console.log(`   ⚠️ Modal test error: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // Main live loop: Runs deep features in randomized order
  // -------------------------------------------------------------
  let cycle = 1;
  while (true) {
    console.log(`\n=============================================================`);
    console.log(`🔄 Starting Cycle #${cycle}...`);
    console.log(`=============================================================`);

    // Run features in randomized order per cycle
    const tasks = [
      testAgentViewDeeply,
      testSidebarDynamicResizeAndPeek,
      testIssuesAndInbox,
      testGlobalSearchAndModals
    ];

    // Shuffle tasks
    tasks.sort(() => Math.random() - 0.5);

    for (const task of tasks) {
      await task();
      // Human-like pause between tasks (1 to 3 seconds)
      const pause = randomBetween(1000, 3000);
      console.log(`   ☕ Short pause (${(pause/1000).toFixed(1)}s)...`);
      await sleep(pause);
    }

    console.log(`\n🎉 Cycle #${cycle} completed!`);
    console.log("📊 Waiting 45 seconds for Hotjar / Contentsquare session sync...");
    await sleep(45000);

    cycle++;
  }
})();