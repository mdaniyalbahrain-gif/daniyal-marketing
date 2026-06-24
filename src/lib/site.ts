export const SITE = {
  name: "Daniyal Marketing Planner",
  short: "Daniyal Marketing",
  tagline: "Turning Clicks Into Customers",
  email: "Daniyalmarketingplan@gmail.com",
  phone: "+973 6697 4524",
  location: "Available Worldwide — Remote First",
  whatsapp: "https://wa.me/97366974524",
  whatsappRaw: "97366974524",
  social: {
    instagram: "https://www.instagram.com/daniyalmarketer/",
    facebook: "https://www.facebook.com/profile.php?id=61590275079271",
    linkedin: "https://www.linkedin.com/in/daniyalmarketer/",
    youtube: "https://www.youtube.com/@Daniyal-marketing",
  },
};

export const waLink = (text: string) =>
  `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
