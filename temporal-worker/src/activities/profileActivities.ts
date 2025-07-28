import fetch from 'node-fetch';

const CRUDCRUD_ENDPOINT = 'https://crudcrud.com/api/YOUR_UNIQUE_KEY_HERE/profiles';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pincode: string;
  city: string; 
}

export async function saveProfileToCrudCrud(profile: Profile): Promise<void> {
  console.log(`Activity] Saving profile: ${profile.fullName}, Email: ${profile.email}`);

  try {
    const response = await fetch(CRUDCRUD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(` Failed to save profile: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Profile saved successfully:', responseData);
  } catch (error) {
    console.error(' Error saving profile:', error);
    throw error;
  }
}
