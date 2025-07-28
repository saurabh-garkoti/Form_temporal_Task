import { Worker } from '@temporalio/worker';
import * as activities from './activities/profileActivities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflow/profileWorkflow'),
    activities,
    taskQueue: 'profile-queue',
  });

  console.log('Temporal Worker started...');
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});