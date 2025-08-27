import { Settings } from '../register';

const action = () => {
  console.log('Hello World!');
};

const seedCommand: Settings = {
  name: 'seed',
  description: 'Seed DB with mock data',
  action,
};

export default seedCommand;
