const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running successfully',
    timestamp: new Date()
  });
});

// Expanded mock catalog with 40 products (5 categories of 8 items, or 8 categories of 4-8 items)
const mockItems = [
  // ─── AIR CONDITIONERS (8 Items) ───
  { 
    id: 1, 
    name: 'Haier 1.5 Ton HSU-18HNS DC Inverter AC', 
    brand: 'Haier',
    category: 'Air Conditioner',
    price: 145000, 
    discountPrice: 135000,
    image: '/images/product_ac.png',
    description: '1.5 Ton DC Inverter Air Conditioner with Wi-Fi control, self-cleaning, and turbo cool technology.',
    specifications: { tonnage: '1.5 Ton', technology: 'DC Inverter', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 2, 
    name: 'Haier 1 Ton HSU-12HNS DC Inverter AC', 
    brand: 'Haier',
    category: 'Air Conditioner',
    price: 115000, 
    discountPrice: 108000,
    image: '/images/product_ac_2.png',
    description: '1 Ton smart inverter AC perfect for bedrooms, equipped with low voltage startup and triple inverter technology.',
    specifications: { tonnage: '1 Ton', technology: 'DC Inverter', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 3, 
    name: 'Gree 1.5 Ton Fairy Series Inverter AC', 
    brand: 'Gree',
    category: 'Air Conditioner',
    price: 165000, 
    discountPrice: 155000,
    image: '/images/product_ac.png',
    description: 'Premium Fairy Series Split AC with elegant design, high ambient cooling, and double-layered condenser.',
    specifications: { tonnage: '1.5 Ton', technology: 'DC Inverter', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 4, 
    name: 'Gree 1.5 Ton Pular Series Inverter AC', 
    brand: 'Gree',
    category: 'Air Conditioner',
    price: 158000, 
    discountPrice: null,
    image: '/images/product_ac_2.png',
    description: 'Elegant Pular series with 3D air flow, dual-rotor inverter compressor, and low noise design.',
    specifications: { tonnage: '1.5 Ton', technology: 'DC Inverter', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 5, 
    name: 'Dawlance 1.5 Ton Chrome Inverter AC', 
    brand: 'Dawlance',
    category: 'Air Conditioner',
    price: 138000, 
    discountPrice: 129000,
    image: '/images/product_ac.png',
    description: 'Dawlance Chrome Inverter AC with heavy duty gold fin condenser and quick cooling operation.',
    specifications: { tonnage: '1.5 Ton', technology: 'DC Inverter', energyRating: '4 Star', warranty: '12 Years Compressor' }
  },
  { 
    id: 6, 
    name: 'Dawlance 1.5 Ton Mega T+ Inverter AC', 
    brand: 'Dawlance',
    category: 'Air Conditioner',
    price: 148000, 
    discountPrice: 139000,
    image: '/images/product_ac_2.png',
    description: 'High efficiency Mega T+ inverter AC with double golden fin protection and smart control.',
    specifications: { tonnage: '1.5 Ton', technology: 'DC Inverter', energyRating: '5 Star', warranty: '12 Years Compressor' }
  },
  { 
    id: 7, 
    name: 'Kenwood 1.5 Ton eInverter Eco AC', 
    brand: 'Kenwood',
    category: 'Air Conditioner',
    price: 142000, 
    discountPrice: 132000,
    image: '/images/product_ac.png',
    description: 'Kenwood Eco series inverter AC with high energy efficiency ratio and eco-friendly gas.',
    specifications: { tonnage: '1.5 Ton', technology: 'eInverter', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 8, 
    name: 'Kenwood 1 Ton eSmart Inverter AC', 
    brand: 'Kenwood',
    category: 'Air Conditioner',
    price: 112000, 
    discountPrice: null,
    image: '/images/product_ac_2.png',
    description: 'Smart series 1 Ton inverter AC with mobile app control and fast cooling functionality.',
    specifications: { tonnage: '1 Ton', technology: 'eInverter', energyRating: '3 Star', warranty: '10 Years Compressor' }
  },

  // ─── REFRIGERATORS (8 Items) ───
  { 
    id: 9, 
    name: 'Dawlance Chrome 350 Inverter Refrigerator', 
    brand: 'Dawlance',
    category: 'Refrigerator',
    price: 95000, 
    discountPrice: 88000,
    image: '/images/product_fridge.png',
    description: 'Chrome series 350L inverter refrigerator with twin fan technology, digital display, and VCM finish.',
    specifications: { capacity: '350 Liters', technology: 'Inverter Compressor', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 10, 
    name: 'Dawlance Avante 9193 Inverter Refrigerator', 
    brand: 'Dawlance',
    category: 'Refrigerator',
    price: 110000, 
    discountPrice: 102000,
    image: '/images/product_fridge_2.png',
    description: 'Premium Avante designer glass door refrigerator with insect repellent technology and hybrid cooling.',
    specifications: { capacity: '400 Liters', technology: 'Inverter Compressor', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 11, 
    name: 'Haier HRF-438 No-Frost Refrigerator', 
    brand: 'Haier',
    category: 'Refrigerator',
    price: 125000, 
    discountPrice: 118000,
    image: '/images/product_fridge.png',
    description: 'Digital display 438L refrigerator with multi air flow, turbo cooling, and multi-zone freshness.',
    specifications: { capacity: '438 Liters', technology: 'Inverter Compressor', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 12, 
    name: 'Haier HRF-306 Glass Door Refrigerator', 
    brand: 'Haier',
    category: 'Refrigerator',
    price: 88000, 
    discountPrice: null,
    image: '/images/product_fridge_2.png',
    description: 'Aesthetic red glass door finish refrigerator with instant icing and low voltage run operations.',
    specifications: { capacity: '306 Liters', technology: 'Regular Compressor', energyRating: '3 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 13, 
    name: 'Pel Glass Door 380 Inverter Refrigerator', 
    brand: 'Pel',
    category: 'Refrigerator',
    price: 86000, 
    discountPrice: 79000,
    image: '/images/product_fridge.png',
    description: 'Elegant glass door finish Pel refrigerator with super fast freeze capability and eco-friendly cooling.',
    specifications: { capacity: '380 Liters', technology: 'Inverter Compressor', energyRating: '3 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 14, 
    name: 'Pel Desire 650 Luxury Refrigerator', 
    brand: 'Pel',
    category: 'Refrigerator',
    price: 115000, 
    discountPrice: null,
    image: '/images/product_fridge_2.png',
    description: 'Desire series double door premium refrigerator with extra wide body and copper condenser.',
    specifications: { capacity: '480 Liters', technology: 'Inverter Compressor', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 15, 
    name: 'Samsung Double Door 500L Refrigerator', 
    brand: 'Samsung',
    category: 'Refrigerator',
    price: 220000, 
    discountPrice: 205000,
    image: '/images/product_fridge.png',
    description: 'Premium smart double door refrigerator with digital inverter, Twin Cooling Plus, and convertible freezer.',
    specifications: { capacity: '500 Liters', technology: 'Digital Inverter', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 16, 
    name: 'Samsung RT38 Digital Inverter Refrigerator', 
    brand: 'Samsung',
    category: 'Refrigerator',
    price: 185000, 
    discountPrice: 176000,
    image: '/images/product_fridge_2.png',
    description: 'High efficiency RT38 model with multi flow cooling, deodorizing filter, and smart connect feature.',
    specifications: { capacity: '380 Liters', technology: 'Digital Inverter', energyRating: '5 Star', warranty: '10 Years Compressor' }
  },

  // ─── LED TVs (8 Items) ───
  { 
    id: 17, 
    name: 'TCL 55" C645 QLED Smart TV', 
    brand: 'TCL',
    category: 'LED TV',
    price: 125000, 
    discountPrice: 118000,
    image: '/images/product_tv.png',
    description: '55 inch QLED television with Dolby Vision, HDR10+, Google OS, and Dolby Atmos audio.',
    specifications: { screen: '55 inch', resolution: '4K QLED', technology: 'Google TV Smart', warranty: '3 Years' }
  },
  { 
    id: 18, 
    name: 'TCL 43" S5400 Full HD TV', 
    brand: 'TCL',
    category: 'LED TV',
    price: 68000, 
    discountPrice: 62000,
    image: '/images/product_tv_2.png',
    description: '43 inch bezel-less Full HD TV with HDR10, Android OS, and built-in Bluetooth.',
    specifications: { screen: '43 inch', resolution: 'Full HD', technology: 'Android 11 OS', warranty: '3 Years' }
  },
  { 
    id: 19, 
    name: 'Sony 43" Bravia X75K 4K Google TV', 
    brand: 'Sony',
    category: 'LED TV',
    price: 135000, 
    discountPrice: null,
    image: '/images/product_tv.png',
    description: 'Bravia 43 inch 4K Google TV with X-Reality PRO processing, TRILUMINOS Display, and Google Play Store.',
    specifications: { screen: '43 inch', resolution: '4K UHD', technology: 'Google TV', warranty: '2 Years' }
  },
  { 
    id: 20, 
    name: 'Sony 55" Bravia X80L 4K Smart TV', 
    brand: 'Sony',
    category: 'LED TV',
    price: 215000, 
    discountPrice: 198000,
    image: '/images/product_tv_2.png',
    description: 'Premium X80L series Bravia TV with X1 processor, 4K HDR, Dolby Atmos, and smart Apple AirPlay.',
    specifications: { screen: '55 inch', resolution: '4K UHD', technology: 'Google TV Smart OS', warranty: '2 Years' }
  },
  { 
    id: 21, 
    name: 'Samsung 65" Crystal UHD Smart TV', 
    brand: 'Samsung',
    category: 'LED TV',
    price: 195000, 
    discountPrice: 185000,
    image: '/images/product_tv.png',
    description: '65 inch premium slim bezel crystal UHD smart TV featuring HDR 10+, Dynamic Crystal Color, and Smart Hub.',
    specifications: { screen: '65 inch', resolution: '4K UHD', technology: 'Tizen Smart OS', warranty: '1 Year' }
  },
  { 
    id: 22, 
    name: 'Samsung 55" AU7000 Smart LED TV', 
    brand: 'Samsung',
    category: 'LED TV',
    price: 145000, 
    discountPrice: null,
    image: '/images/product_tv_2.png',
    description: '55 inch Crystal UHD TV featuring Q-Symphony sound sync, PurColor technology, and PC mode.',
    specifications: { screen: '55 inch', resolution: '4K UHD', technology: 'Tizen Smart OS', warranty: '1 Year' }
  },
  { 
    id: 23, 
    name: 'Changhong Ruba 32" Smart LED TV', 
    brand: 'Changhong Ruba',
    category: 'LED TV',
    price: 38000, 
    discountPrice: 34000,
    image: '/images/product_tv.png',
    description: 'Budget-friendly 32 inch Smart LED TV with android OS, screen mirroring, and HDMI ports.',
    specifications: { screen: '32 inch', resolution: 'HD Ready', technology: 'Android Smart TV', warranty: '2 Years' }
  },
  { 
    id: 24, 
    name: 'Changhong Ruba 40" Full HD Smart TV', 
    brand: 'Changhong Ruba',
    category: 'LED TV',
    price: 58000, 
    discountPrice: 53000,
    image: '/images/product_tv_2.png',
    description: '40 inch Full HD smart television featuring direct led backlight, smart voice search, and dual HDMI.',
    specifications: { screen: '40 inch', resolution: 'Full HD', technology: 'Android Smart TV', warranty: '2 Years' }
  },

  // ─── WASHING MACHINES (8 Items) ───
  { 
    id: 25, 
    name: 'Haier HWM 120-1678 Front Load Washer', 
    brand: 'Haier',
    category: 'Washing Machine',
    price: 115000, 
    discountPrice: 108000,
    image: '/images/product_washer.png',
    description: '12kg front load inverter washing machine with steam wash, Direct Motion Motor, and 1400 RPM spin.',
    specifications: { capacity: '12 kg', technology: 'Inverter Direct Drive', energyRating: '5 Star', warranty: '10 Years Motor' }
  },
  { 
    id: 26, 
    name: 'Haier HWM 85-826 Top Load Fully Auto', 
    brand: 'Haier',
    category: 'Washing Machine',
    price: 62000, 
    discountPrice: 57000,
    image: '/images/product_washer_2.png',
    description: '8.5kg fully automatic top loader with fuzzy logic control, pillow drum, and rust-free body cabinet.',
    specifications: { capacity: '8.5 kg', technology: 'Fully Automatic Top Load', energyRating: '4 Star', warranty: '10 Years Motor' }
  },
  { 
    id: 27, 
    name: 'Dawlance Top Load 9kg Semi-Auto Washer', 
    brand: 'Dawlance',
    category: 'Washing Machine',
    price: 48000, 
    discountPrice: 44000,
    image: '/images/product_washer.png',
    description: 'Heavy duty top load semi-automatic washing machine with double storm pulsator and quick spin dry.',
    specifications: { capacity: '9 kg', technology: 'Semi-Automatic Twin Tub', energyRating: '3 Star', warranty: '2 Years Parts & Motor' }
  },
  { 
    id: 28, 
    name: 'Dawlance DWT 260 Fully Automatic Washer', 
    brand: 'Dawlance',
    category: 'Washing Machine',
    price: 74000, 
    discountPrice: null,
    image: '/images/product_washer_2.png',
    description: '9kg fully automatic top load washing machine with triple waterfall technology and pro-fabric drum design.',
    specifications: { capacity: '9 kg', technology: 'Fully Automatic Top Load', energyRating: '4 Star', warranty: '10 Years Motor' }
  },
  { 
    id: 29, 
    name: 'Kenwood 12kg Fully Automatic Washer', 
    brand: 'Kenwood',
    category: 'Washing Machine',
    price: 88000, 
    discountPrice: 82000,
    image: '/images/product_washer.png',
    description: '12kg luxury top-loading fully automatic washing machine with smart clean wash technology and digital control.',
    specifications: { capacity: '12 kg', technology: 'Fully Automatic Top Load', energyRating: '4 Star', warranty: '3 Years Motor' }
  },
  { 
    id: 30, 
    name: 'Kenwood KWM-7002 Semi-Automatic Washer', 
    brand: 'Kenwood',
    category: 'Washing Machine',
    price: 36000, 
    discountPrice: null,
    image: '/images/product_washer_2.png',
    description: '7kg twin tub washing machine with active lint filter, powerful pulsator, and heavy-duty plastic body.',
    specifications: { capacity: '7 kg', technology: 'Twin Tub Semi-Auto', energyRating: '3 Star', warranty: '1 Year Parts & Motor' }
  },
  { 
    id: 31, 
    name: 'Super Asia SA-240 Twin Tub Washer', 
    brand: 'Super Asia',
    category: 'Washing Machine',
    price: 34000, 
    discountPrice: 29500,
    image: '/images/product_washer.png',
    description: '8kg twin tub washing machine from Super Asia with double storm wash action and heavy duty gear transmission.',
    specifications: { capacity: '8 kg', technology: 'Twin Tub Semi-Auto', energyRating: '3 Star', warranty: '2 Years Motor' }
  },
  { 
    id: 32, 
    name: 'Super Asia SA-270 Single Tub Washer', 
    brand: 'Super Asia',
    category: 'Washing Machine',
    price: 22000, 
    discountPrice: 19900,
    image: '/images/product_washer_2.png',
    description: '10kg single tub washing machine, powerful motor, large capacity tub, shock-free plastic body.',
    specifications: { capacity: '10 kg', technology: 'Single Tub Washer', energyRating: '3 Star', warranty: '2 Years Motor' }
  },

  // ─── KITCHEN APPLIANCES (2 Items) ───
  { 
    id: 33, 
    name: 'Dawlance Air Fryer DWAF-3013', 
    brand: 'Dawlance',
    category: 'Kitchen Appliances',
    price: 28000, 
    discountPrice: 25000,
    image: '/images/product_kitchen.png',
    description: 'Smart air fryer with digital touchscreen, 8 preset cooking menus, and 3.5L cooking capacity.',
    specifications: { capacity: '3.5 Liters', power: '1500 Watts', controls: 'Digital Touch', warranty: '1 Year Parts' }
  },
  { 
    id: 34, 
    name: 'Kenwood Food Processor FDP-301', 
    brand: 'Kenwood',
    category: 'Kitchen Appliances',
    price: 34000, 
    discountPrice: null,
    image: '/images/product_kitchen.png',
    description: 'Multi-functional food processor with blender attachment, chopping blade, and stainless steel disks.',
    specifications: { speedSettings: '2 Speed + Pulse', bowlCapacity: '2.1 Liters', power: '800 Watts', warranty: '1 Year' }
  },

  // ─── MICROWAVE OVENS (2 Items) ───
  { 
    id: 35, 
    name: 'Haier HWD-20MX Microwave Oven', 
    brand: 'Haier',
    category: 'Microwave Oven',
    price: 24000, 
    discountPrice: 22000,
    image: '/images/product_microwave.png',
    description: 'Solo microwave oven with 5 power levels, defrost function, and easy mechanical control dial.',
    specifications: { capacity: '20 Liters', controlType: 'Mechanical Dial', powerLevels: '5 levels', warranty: '1 Year' }
  },
  { 
    id: 36, 
    name: 'Dawlance DW-297 Microwave Oven', 
    brand: 'Dawlance',
    category: 'Microwave Oven',
    price: 29000, 
    discountPrice: null,
    image: '/images/product_microwave.png',
    description: 'Premium grill microwave oven with digital panel, child lock safety, and express cooking function.',
    specifications: { capacity: '23 Liters', controlType: 'Digital Touch', feature: 'Grill + Microwave', warranty: '2 Years' }
  },

  // ─── WATER DISPENSERS (2 Items) ───
  { 
    id: 37, 
    name: 'Gree Water Dispenser GW-101', 
    brand: 'Gree',
    category: 'Water Dispenser',
    price: 38000, 
    discountPrice: 35000,
    image: '/images/product_dispenser.png',
    description: 'Double nozzle water dispenser with rapid cooling, bottom storage cabinet, and child lock hot tap.',
    specifications: { nozzles: '2 (Hot & Cold)', compressor: 'High efficiency', cabinet: 'Bottom fridge', warranty: '1 Year' }
  },
  { 
    id: 38, 
    name: 'Homage Water Dispenser HWD-28', 
    brand: 'Homage',
    category: 'Water Dispenser',
    price: 31000, 
    discountPrice: null,
    image: '/images/product_dispenser.png',
    description: 'Glass-front design water dispenser with low noise operations and energy-efficient compressor cooling.',
    specifications: { nozzles: '2 (Hot & Cold)', cabinet: 'Storage drawer', powerConsumption: 'Low', warranty: '1 Year' }
  },

  // ─── DEEP FREEZERS (2 Items) ───
  { 
    id: 39, 
    name: 'Dawlance Deep Freezer DF-200', 
    brand: 'Dawlance',
    category: 'Deep Freezer',
    price: 75000, 
    discountPrice: 69000,
    image: '/images/product_freezer.png',
    description: 'Single cabinet deep freezer with fast freeze technology, rust-free sheet, and copper evaporator coils.',
    specifications: { capacity: '200 Liters', type: 'Single Chest', energyRating: '4 Star', warranty: '10 Years Compressor' }
  },
  { 
    id: 40, 
    name: 'Haier Deep Freezer HDF-325', 
    brand: 'Haier',
    category: 'Deep Freezer',
    price: 85000, 
    discountPrice: 78000,
    image: '/images/product_freezer.png',
    description: 'Double door chest deep freezer with super fast freeze capability, dual thermostat, and LED lighting.',
    specifications: { capacity: '325 Liters', type: 'Double Chest Door', energyRating: '5 Star', warranty: '10 Years Compressor' }
  }
];

app.get('/api/items', (req, res) => {
  res.status(200).json({ status: 'success', data: mockItems });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Background DB Connection check
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      console.log('Continuing server operations in offline database mode...');
    });
} else {
  console.log('No MONGODB_URI found. Server is running in offline database mode.');
}
