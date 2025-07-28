using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Form_temporal.Models;
using server.Data;
using Temporalio.Client;
using server.Workflows;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileContext _context;
        private readonly TemporalClient _temporalClient;

        public ProfileController(ProfileContext context, TemporalClient temporalClient)
        {
            _context = context;
            _temporalClient = temporalClient;
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> SubmitProfile([FromBody] Profile profile)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                Profile savedProfile;
                var existing = await _context.Profiles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Email.ToLower() == profile.Email.ToLower());

                if (existing != null)
                {
                    profile.Id = existing.Id;
                    _context.Profiles.Update(profile);
                    await _context.SaveChangesAsync();

                    Console.WriteLine($"Profile updated for: {profile.FirstName} {profile.LastName}");
                    savedProfile = profile;
                }
                else
                {
                    _context.Profiles.Add(profile);
                    await _context.SaveChangesAsync();

                    Console.WriteLine($"Profile created for: {profile.FirstName} {profile.LastName}");
                    savedProfile = profile;
                }
                bool workflowStarted = true;
                string? workflowError = null;

                try
                {
                    await _temporalClient.StartWorkflowAsync(
                        (IProfileWorkflow wf) => wf.RunAsync(savedProfile),
                        new WorkflowOptions
                        {
                            Id = $"profile-{savedProfile.Id}",
                            TaskQueue = "profile-task-queue"
                        });

                    Console.WriteLine("Workflow started successfully.");
                }
                catch (Exception ex)
                {
                    workflowStarted = false;
                    workflowError = ex.Message;
                    Console.WriteLine("Failed to start workflow: " + ex);
                }

                return Ok(new
                {
                    message = "Profile saved",
                    profile = savedProfile,
                    workflowStarted,
                    workflowError
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Unexpected error: " + ex);
                return StatusCode(500, new
                {
                    error = "Internal server error",
                    detail = ex.Message
                });
            }
        }

        // GET
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var profiles = await _context.Profiles.ToListAsync();
            return Ok(profiles);
        }

        // GET by Email
        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.Email.ToLower() == email.ToLower());

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(profile);
        }
    }
}
