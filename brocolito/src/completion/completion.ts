import minimist from 'minimist';
import { showInstallInstruction } from './install.js';
import { Tabtab, TabtabEnv } from './tabtab.js';
import { State } from '../state';
import { findCommand } from '../parse';
import { OptionMeta } from '../types';
import { Arguments } from '../arguments';

const FileCompletion = ['__files__'];

export const _completion = async ({ prev, line }: TabtabEnv): Promise<string[]> => {
  // top level
  if (prev === State.name) return Object.keys(State.commands).concat(['--help']);

  const lineArgs = line.split(' ');
  const minimistArgs = minimist(lineArgs.slice(2));
  const foundCommand = findCommand(minimistArgs._);
  if (typeof foundCommand === 'string') return [];
  const [command, args] = foundCommand;
  const commandArgs = command.args.slice(args.length); // all arguments that can still be used
  const options = Object.values(command.options) as OptionMeta[];
  const optionNames = options.map(({ name }) => name);
  const startedOption = options.find(({ name }) => name === prev);
  const lastUsedOptionArg = lineArgs.filter((arg) => optionNames.includes(arg)).at(-1);
  const lastUsedOption = options.find(({ name }) => name === lastUsedOptionArg);
  const lastUsedOptionInfo = lastUsedOption ? Arguments.deriveOptionInfo(lastUsedOption.usage) : undefined;
  if (startedOption) {
    // TODO: Custom parsers and options
    const { type } = Arguments.deriveOptionInfo(startedOption.usage);
    if (type === 'boolean') return ['true', 'false'];
    if (type === 'file') return FileCompletion;
    return [];
  } else if (commandArgs.length) {
    // TODO: Custom parsers and options
    const { type } = Arguments.deriveInfo(commandArgs[0].usage);
    if (type === 'file') return FileCompletion;
    return [];
  } else if (prev === command.name) {
    // TODO: Make use of descriptions for completion by using CompletionItems instead of plain strings
    return Object.keys(command.subcommands).concat(optionNames);
  } else if (lastUsedOptionInfo?.multi) {
    const { type } = lastUsedOptionInfo;
    if (type === 'boolean') return ['true', 'false'];
    if (type === 'file') return FileCompletion;
    return [];
  } else {
    return optionNames;
  }
};

const completion = async (env: TabtabEnv) => {
  const result = await _completion(env);
  result === FileCompletion ? Tabtab.logFiles() : Tabtab.log(result);
};

const run = async (): Promise<void> => {
  const env = Tabtab.parseEnv(process.env);
  if (env.complete) return completion(env);

  showInstallInstruction();
};

export const Completion = { run };