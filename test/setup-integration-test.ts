import { startDockerPostgresql } from './docker-manager';
import teardown from './teardown-integration-test';

const setup = async (): Promise<void> => {
  try {
    await startDockerPostgresql();
  } catch (error) {
    await teardown();
  }
};

export default setup;
