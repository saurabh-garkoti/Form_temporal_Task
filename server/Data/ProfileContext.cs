using Form_temporal.Models;

using Microsoft.EntityFrameworkCore;
namespace server.Data
{
    public class ProfileContext : DbContext
    {
        public ProfileContext(DbContextOptions<ProfileContext> options) : base(options)
        {
        }

        public DbSet<Profile> Profiles { get; set; }
    }
}
