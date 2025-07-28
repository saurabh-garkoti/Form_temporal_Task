import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/profileActivities';
import type { Profile } from '../activities/profileActivities';

const { saveProfileToCrudCrud } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
});

export async function profileWorkflow(profile: Profile): Promise<void> {
  console.log(`Waiting 10 seconds before saving profile for ${profile.fullName}`);

  await sleep(10 * 1000);

  console.log(`Saving profile to CrudCrud: ${profile.fullName}`);
  await saveProfileToCrudCrud(profile);
}
