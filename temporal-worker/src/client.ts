import { Connection, WorkflowClient, WorkflowIdReusePolicy } from '@temporalio/client';
import { v4 as uuidv4 } from 'uuid';
import * as wf from './workflow/profileWorkflow';

export async function startProfileWorkflow(profile: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pincode: string;
  city: string; 
}) {
  // const connection = await Connection.connect();
  const connection = await Connection.connect({
  address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
});

  const client = new WorkflowClient({ connection });

  const id = uuidv4();
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const result = await client.start(wf.profileWorkflow, {
    taskQueue: 'profile-queue',
    args: [
      {
        id,
        fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        pincode: profile.pincode,
        city: profile.city, 
      },
    ],
    workflowId: `profile-${id}`,
    workflowIdReusePolicy: WorkflowIdReusePolicy.ALLOW_DUPLICATE,
  });

  console.log(' Workflow started:', result.workflowId);
}
