import * as migration_20261103_074518_initial from './20261103_074518_initial';

export const migrations = [
  {
    up: migration_20261103_074518_initial.up,
    down: migration_20261103_074518_initial.down,
    name: '20261103_074518_initial'
  },
];
