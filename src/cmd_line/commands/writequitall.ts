import { VimState } from '../../state/vimState';
import { ExCommand } from '../../vimscript/exCommand';
import * as wall from '../commands/wall';
import * as quit from './quit';

//
// Implements :writequitall
// http://vimdoc.sourceforge.net/htmldoc/editing.html#:wqall
//
export interface IWriteQuitAllCommandArguments {
  // arguments
  // [++opt]
  opt?: string;
  optValue?: string;
  // wqa! [++opt]
  bang?: boolean;
}

export class WriteQuitAllCommand extends ExCommand {
  private readonly arguments: IWriteQuitAllCommandArguments;

  constructor(args: IWriteQuitAllCommandArguments) {
    super();
    this.arguments = args;
  }

  // Writing command. Taken as a basis from the "write.ts" file.
  async execute(vimState: VimState): Promise<void> {
    const writeArgs: wall.IWallCommandArguments = {
      bang: this.arguments.bang,
    };

    const quitArgs: quit.IQuitCommandArguments = {
      // wq! fails when no file name is provided
      bang: false,
    };

    const wallCmd = new wall.WallCommand(writeArgs);
    await wallCmd.execute(vimState);

    quitArgs.quitAll = true;
    const quitCmd = new quit.QuitCommand(quitArgs);
    await quitCmd.execute(vimState);
  }
}
