using Form_temporal.Models;
using Temporalio.Workflows;
using System.Threading.Tasks;

namespace server.Workflows
{
    [Workflow]
    public interface IProfileWorkflow
    {
        [WorkflowRun]
        Task RunAsync(Profile profile);
    }
}
