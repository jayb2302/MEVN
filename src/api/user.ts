export const fetchUserById = async (userId: string) => {
  const res = await fetch(`http://localhost:4000/api/user/${userId}`);
  console.log('Fetching user for ID:', userId);
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
};
