import * as assert from 'assert';
import * as vscode from 'vscode';

import { getAndUpdateModeHandler } from '../../extension';
import { commandLine } from '../../src/cmd_line/commandLine';
import { ModeHandler } from '../../src/mode/modeHandler';
import { newTest } from '../testSimplifier';
import { cleanUpWorkspace, setupWorkspace, WaitForEditorsToClose } from './../testUtils';

suite('Basic write-quit', () => {
  let modeHandler: ModeHandler;

  setup(async () => {
    await setupWorkspace();
    modeHandler = (await getAndUpdateModeHandler())!;
  });

  suiteTeardown(cleanUpWorkspace);

  test('Run write and quit', async () => {
    await modeHandler.handleMultipleKeyEvents(['i', 'a', 'b', 'a', '<Esc>']);

    await commandLine.Run('wq', modeHandler.vimState);
    await WaitForEditorsToClose();

    assert.strictEqual(vscode.window.visibleTextEditors.length, 0, 'Window after 1sec still open');
  });

  newTest({
    title: ':q[uit] cannot close dirty file',
    start: ['one', 't|wo', 'three'],
    keysPressed: 'x' + ':q\n',
    end: ['one', 't|o', 'three'],
    statusBar: 'E37: No write since last change (add ! to override)',
  });
});
