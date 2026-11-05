import * as migration_20261103_074518_initial from './20261103_074518_initial';
import * as migration_20261105_063735_hero_slider from './20261105_063735_hero_slider';

export const migrations = [
  {
    up: migration_20261103_074518_initial.up,
    down: migration_20261103_074518_initial.down,
    name: '20261103_074518_initial',
  },
  {
    up: migration_20261105_063735_hero_slider.up,
    down: migration_20261105_063735_hero_slider.down,
    name: '20261105_063735_hero_slider'
  },
];
