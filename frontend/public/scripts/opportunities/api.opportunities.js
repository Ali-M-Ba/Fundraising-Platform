export const fetchOrphans = async () => {
  const result = await fetch("/api/orphan");
  return await result.json();
};

export const fetchCampaigns = async () => {
  const result = await fetch("/api/campaign");
  return await result.json();
};

export const addItemToCart = async ({
  donationType,
  recipientId,
  donationTypeRef,
  amount,
}) => {
  return await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      donationType,
      recipientId,
      donationTypeRef,
      amount,
    }),
  });
};
