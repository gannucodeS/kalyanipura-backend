const mongoose = require('mongoose');
const { env } = require('../config');
const Event = require('../models/Event');
const Ministry = require('../models/Ministry');
const GalleryItem = require('../models/GalleryItem');
const ServiceTime = require('../models/ServiceTime');
const ZoomMeeting = require('../models/ZoomMeeting');

const serviceTimes = [
  {
    title: 'Sunday Worship', titleHi: 'रविवार आराधना',
    time: '9:00 AM & 11:00 AM', timeHi: 'सुबह 9:00 बजे और 11:00 बजे',
    tagline: 'LIVE & ONLINE', taglineHi: 'लाइव और ऑनलाइन',
    category: 'SANCTUARY', categoryHi: 'प्रार्थना भवन',
    icon: 'sun',
  },
  {
    title: 'Wednesday Prayer', titleHi: 'बुधवार प्रार्थना',
    time: '7:00 PM', timeHi: 'शाम 7:00 बजे',
    tagline: 'MID-WEEK RENEWAL', taglineHi: 'सप्ताह-मध्य नवीनीकरण',
    category: 'CHAPEL', categoryHi: 'चैपल',
    icon: 'moon',
  },
  {
    title: 'Youth Fellowship', titleHi: 'युवा संगति',
    time: 'Saturdays at 5:00 PM', timeHi: 'शनिवार शाम 5:00 बजे',
    tagline: 'GRADES 7–12', taglineHi: 'कक्षा 7–12',
    category: 'YOUTH HALL', categoryHi: 'युवा हॉल',
    icon: 'users',
  },
];

const galleryItems = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
    description: 'Sunday morning fellowship and coffee in the courtyard lounge.',
    descriptionHi: 'रविवार सुबह आंगन लाउंज में संगति और कॉफी।',
    category: 'Fellowship', categoryHi: 'संगति',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Our beautifully designed sanctuary chapel glowing warmly during twilight.',
    descriptionHi: 'हमारा सुंदर रूप से डिज़ाइन किया गया चैपल गोधूलि में गर्माहट से चमकता हुआ।',
    category: 'Architecture', categoryHi: 'वास्तुकला',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
    description: 'Serene sunset view framing the church grounds, invoking peaceful wonder.',
    descriptionHi: 'चर्च परिसर को सुंदर बनाता शांत सूर्यास्त दृश्य, शांतिपूर्ण विस्मय जगाता।',
    category: 'Worship', categoryHi: 'आराधना',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
    description: 'A view from the back pews as natural sunlight illuminates the sanctuary.',
    descriptionHi: 'पिछली पंक्तियों से दृश्य जब प्राकृतिक सूर्यप्रकाश प्रार्थना भवन को रोशन करता है।',
    category: 'Interior', categoryHi: 'आंतरिक भाग',
  },
];

const ministries = [
  {
    title: "Children's Ministry", titleHi: "बच्चों की सेवकाई",
    tagline: 'WELCOME HOME CHILDS', taglineHi: 'बच्चों का स्वागत है',
    iconName: 'smile',
    description: "Nurturing the youngest hearts in a safe, fun, and Christ-centered environment every Sunday morning.",
    descriptionHi: "हर रविवार सुबह एक सुरक्षित, मजेदार और मसीह-केंद्रित वातावरण में छोटे दिलों का पोषण।",
    detailedDescription: "Kalyanipura Kids is our dedicated children's ministry where kids of all ages (newborn through 5th grade) can discover God's love through age-appropriate stories, creative crafts, energetic worship, and small group discussions.",
    detailedDescriptionHi: "कल्याणीपुरा किड्स हमारी समर्पित बच्चों की सेवकाई है जहां सभी उम्र के बच्चे उम्र-उपयुक्त कहानियों, रचनात्मक शिल्प, ऊर्जावान आराधना और छोटे समूह चर्चाओं के माध्यम से परमेश्वर के प्रेम की खोज कर सकते हैं।",
    meetingTimes: "Every Sunday at 9:00 AM & 11:00 AM",
    meetingTimesHi: "हर रविवार सुबह 9:00 बजे और 11:00 बजे",
    contactEmail: "kids@kalyanipurachurch.org",
    volunteerNeeds: "We are always looking for warm small group leaders, welcoming check-in hosts, and creative teachers.",
    volunteerNeedsHi: "हम हमेशा गर्मजोशी छोटे समूह नेताओं, स्वागतशील जाँच-पड़ताल होस्ट और रचनात्मक शिक्षकों की तलाश में हैं।",
  },
  {
    title: "Small Groups", titleHi: "छोटे समूह",
    tagline: 'WALK TOGETHER', taglineHi: 'एक साथ चलें',
    iconName: 'users',
    description: "Doing life together. Join a local group for fellowship, prayer, and deep biblical study in homes across the city.",
    descriptionHi: "एक साथ जीवन जीना। शहर भर के घरों में संगति, प्रार्थना और गहन बाइबल अध्ययन के लिए एक स्थानीय समूह में शामिल हों।",
    detailedDescription: "Growth happens best in relationships. Our Small Groups are cozy gatherings of 8 to 15 people that meet weekly or bi-weekly — studying scripture, sharing meals, seeking prayer, and supporting one another.",
    detailedDescriptionHi: "विकास रिश्तों में सबसे अच्छा होता है। हमारे छोटे समूह 8 से 15 लोगों की आरामदायक सभाएं हैं जो साप्ताहिक या पाक्षिक मिलती हैं — शास्त्र का अध्ययन, भोजन साझा करना, प्रार्थना करना और एक दूसरे का समर्थन करना।",
    meetingTimes: "Dispersed schedule (Mon–Fri evenings, various homes)",
    meetingTimesHi: "विविध समय (सोम-शुक्र शाम, विभिन्न घर)",
    contactEmail: "smallgroups@kalyanipurachurch.org",
    volunteerNeeds: "Host homes and group facilitators are needed as we continue launching new circles across Kalyanipura.",
    volunteerNeedsHi: "जैसे-जैसे हम कल्याणीपुरा में नए समूह शुरू कर रहे हैं, मेज़बान घरों और समूह संचालकों की आवश्यकता है।",
  },
  {
    title: "Outreach & Missions", titleHi: "आउटरीच और मिशन",
    tagline: 'SERVE OTHERS', taglineHi: 'दूसरों की सेवा',
    iconName: 'heart',
    description: "Being the hands and feet of Jesus in our local community and supporting missions across the globe.",
    descriptionHi: "हमारे स्थानीय समुदाय में यीशु के हाथ और पैर बनना और दुनिया भर में मिशनों का समर्थन करना।",
    detailedDescription: "Kalyanipura Outreach partners with local food pantries, shelter homes, and rehabilitation programs. We also directly sponsor field missionaries globally to support development, medical aid, and spiritual education.",
    detailedDescriptionHi: "कल्याणीपुरा आउटरीच स्थानीय खाद्य पेंट्री, आश्रय गृहों और पुनर्वास कार्यक्रमों के साथ साझेदारी करता है। हम विकास, चिकित्सा सहायता और आध्यात्मिक शिक्षा के लिए वैश्विक स्तर पर मिशनरियों को प्रायोजित करते हैं।",
    meetingTimes: "First Saturday of each month (Outreach days) & seasonal trips",
    meetingTimesHi: "प्रत्येक माह का पहला शनिवार (आउटरीच दिवस) और मौसमी यात्राएं",
    contactEmail: "missions@kalyanipurachurch.org",
    volunteerNeeds: "Active volunteers for our monthly food drive, shelter lunch servers, and global mission trip applicants.",
    volunteerNeedsHi: "हमारे मासिक खाद्य अभियान, आश्रय दोपहर भोजन सेवकों और वैश्विक मिशन यात्रा आवेदकों के लिए सक्रिय स्वयंसेवक।",
  },
];

const events = [
  {
    day: '24',
    month: 'OCT',
    title: 'Harvest Community Festival', titleHi: 'फसल सामुदायिक उत्सव',
    time: '4:00 PM – 8:00 PM', timeHi: 'शाम 4:00 बजे – 8:00 बजे',
    location: 'Main Courtyard', locationHi: 'मुख्य आंगन',
    description: 'Join us for an evening of celebration, seasonal food, and community games for all ages. Perfect for families looking to connect!',
    descriptionHi: 'सभी उम्र के लिए उत्सव, मौसमी भोजन और सामुदायिक खेलों की शाम में हमसे जुड़ें। जुड़ने के इच्छुक परिवारों के लिए एकदम सही!',
    rsvpCount: 142,
  },
  {
    day: '02',
    month: 'NOV',
    title: "Men's Breakfast & Study", titleHi: 'पुरुष नाश्ता और अध्ययन',
    time: '8:00 AM – 10:00 AM', timeHi: 'सुबह 8:00 बजे – 10:00 बजे',
    location: 'Fellowship Hall', locationHi: 'संगति हॉल',
    description: 'A morning of great food and even better conversation as we dive deep into our current biblical study series together.',
    descriptionHi: 'बेहतरीन भोजन और उससे भी बेहतर बातचीत की सुबह, जब हम एक साथ अपनी वर्तमान बाइबल अध्ययन श्रृंखला में गहराई से उतरते हैं।',
    rsvpCount: 57,
  },
  {
    day: '24',
    month: 'DEC',
    title: 'Christmas Candlelight Service', titleHi: 'क्रिसमस मोमबत्ती सेवा',
    time: '6:00 PM & 8:00 PM', timeHi: 'शाम 6:00 बजे और 8:00 बजे',
    location: 'Main Sanctuary', locationHi: 'मुख्य प्रार्थना भवन',
    description: 'Gather with us for a beautiful candlelit evening celebrating the birth of Christ through traditional carols, beautiful choir arrangements, and a heartfelt message.',
    descriptionHi: 'पारंपरिक भजनों, सुंदर गायक मंडली प्रस्तुतियों और हार्दिक संदेश के माध्यम से मसीह के जन्म का जश्न मनाने के लिए हमारे साथ एक सुंदर मोमबत्ती की रात में इकट्ठा हों।',
    rsvpCount: 310,
  },
];

const zoomMeeting = {
  title: 'Sunday Worship Service',
  titleHi: 'रविवार आराधना सेवा',
  description: 'Join us for our weekly Sunday worship service.',
  descriptionHi: 'हमारी साप्ताहिक रविवार आराधना सेवा के लिए जुड़ें।',
  joinUrl: '',
  date: null,
  time: '10:00 AM',
  timeZone: 'Asia/Kolkata',
  isActive: true,
};

const models = [
  { name: 'ServiceTime', data: serviceTimes, Model: ServiceTime },
  { name: 'GalleryItem', data: galleryItems, Model: GalleryItem },
  { name: 'Ministry', data: ministries, Model: Ministry },
  { name: 'Event', data: events, Model: Event },
];

async function seedZoomMeeting() {
  const existing = await ZoomMeeting.countDocuments({ isDeleted: false });
  if (existing > 0) {
    console.log(`ZoomMeeting: ${existing} items exist, skipping seed.`);
    return;
  }
  await ZoomMeeting.create(zoomMeeting);
  console.log('ZoomMeeting: seeded 1 item.');
}

async function seed() {
  for (const { name, data, Model } of models) {
    const existing = await Model.countDocuments({ isDeleted: false });
    if (existing > 0) {
      console.log(`${name}: ${existing} items exist, skipping seed.`);
      continue;
    }
    const inserted = await Model.insertMany(data);
    console.log(`${name}: seeded ${inserted.length} items.`);
  }
  await seedZoomMeeting();
  console.log('Seed complete.');
}

if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(env.mongodbUri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB');
      await seed();
    } catch (err) {
      console.error('Seed error:', err.message);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
    }
  })();
} else {
  module.exports = seed;
}
