import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { LogoutOptions } from "@auth0/auth0-react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    pincode: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const res = await fetch(
            `http://localhost:5229/api/profile/${encodeURIComponent(user.email)}`
          );

          if (res.ok) {
            const data = await res.json();
            if (data?.firstName || data?.lastName) {
              setProfile(data);
            } else {
              setProfile((prev) => ({ ...prev, email: user.email! }));
            }
          } else {
            setProfile((prev) => ({ ...prev, email: user.email! }));
          }
        } catch (err) {
          console.error("Failed to load profile:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Saving profile...");
    try {
      const response = await fetch("http://localhost:5229/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      toast.dismiss();

      if (response.ok) {
        const result = await response.json();
        toast.success("Profile saved & workflow started!");
        console.log("Profile submitted:", result);
      } else {
        const error = await response.json();
        toast.error("Save failed: " + error.detail);
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      toast.dismiss();
      toast.error("Failed to submit profile");
    }
  };

  if (isLoading || loading) {
    return <div>Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access your profile.</div>;
  }

  type ProfileFields =
    | "firstName"
    | "lastName"
    | "email"
    | "phoneNumber"
    | "city"
    | "pincode";

  const fieldLabels: { [key in ProfileFields]: string } = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phoneNumber: "Phone Number",
    city: "City",
    pincode: "Pincode",
  };

  return (
    <div className="profile-form">
      <Toaster />
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(fieldLabels).map((field) => (
          <div key={field}>
            <label>{fieldLabels[field as ProfileFields]}</label>
            <input
              type="text"
              name={field}
              value={profile[field as ProfileFields]}
              onChange={handleChange}
              disabled={field === "email"}
            />
          </div>
        ))}

        <div className="Profileactions">
          <button type="submit">Save Profile</button>
          <button
            type="button"
            onClick={() =>
              logout({ returnTo: window.location.origin } as LogoutOptions)
            }
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
