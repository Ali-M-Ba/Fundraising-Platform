export const fetchDonations = async () => {
  const res = await fetch("/api/donation");
  return res.json();
};
