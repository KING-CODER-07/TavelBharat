import { prisma } from '@/lib/prisma';

async function main() {
  console.log('Seeding database with extended cities...');

  const categories = ['Heritage', 'Nature', 'Religious', 'Adventure', 'Cultural'];
  const categoryMap: Record<string, any> = {};
  for (const catName of categories) {
    let cat = await prisma.category.findUnique({ where: { name: catName } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name: catName } });
    }
    categoryMap[catName] = cat;
  }

  const statesData = [
    { name: 'Andhra Pradesh', description: 'Known for its rich cultural heritage and ancient temples.', image: '/images/destinations/andhra-pradesh.jpg', cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati'] },
    { name: 'Arunachal Pradesh', description: 'The land of dawn-lit mountains.', image: '/images/destinations/arunachal-pradesh.jpg', cities: ['Itanagar', 'Tawang', 'Ziro'] },
    { name: 'Assam', description: 'Famous for its tea gardens and wildlife.', image: '/images/destinations/assam.jpg', cities: ['Guwahati', 'Silchar', 'Dibrugarh'] },
    { name: 'Bihar', description: 'The cradle of history and culture.', image: '/images/destinations/bihar.jpg', cities: ['Patna', 'Gaya', 'Bhagalpur'] },
    { name: 'Goa', description: 'Famous for its pristine beaches and vibrant nightlife.', image: '/images/destinations/goa.jpg', cities: ['Panaji', 'Vasco da Gama', 'Margao'] },
    { name: 'Gujarat', description: 'Home to the Asiatic lion and vast salt deserts.', image: '/images/destinations/gujarat.jpg', cities: ['Ahmedabad', 'Surat', 'Vadodara'] },
    { name: 'Himachal Pradesh', description: 'Spectacular mountains and valleys.', image: '/images/destinations/himachal-pradesh.jpg', cities: ['Shimla', 'Manali', 'Dharamshala'] },
    { name: 'Karnataka', description: 'A mix of modern technology and ancient ruins.', image: '/images/destinations/karnataka.jpg', cities: ['Bengaluru', 'Mysuru', 'Hubli'] },
    { name: 'Kerala', description: 'God\'s own country.', image: '/images/destinations/kerala.jpg', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'] },
    { name: 'Madhya Pradesh', description: 'The heart of India.', image: '/images/destinations/madhya-pradesh.jpg', cities: ['Indore', 'Bhopal', 'Jabalpur'] },
    { name: 'Maharashtra', description: 'Land of diverse cultures and bustling cities.', image: '/images/destinations/maharashtra.jpg', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Punjab', description: 'The land of five rivers.', image: '/images/destinations/punjab.jpg', cities: ['Ludhiana', 'Amritsar', 'Jalandhar'] },
    { name: 'Rajasthan', description: 'The land of Kings.', image: '/images/destinations/rajasthan.jpg', cities: ['Jaipur', 'Udaipur', 'Jodhpur'] },
    { name: 'Tamil Nadu', description: 'Land of temples and traditions.', image: '/images/destinations/tamil-nadu.jpg', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
    { name: 'Uttar Pradesh', description: 'Home to the majestic Taj Mahal.', image: '/images/destinations/uttar-pradesh.jpeg', cities: ['Lucknow', 'Kanpur', 'Agra'] },
    { name: 'Uttarakhand', description: 'Devbhumi, the land of the gods.', image: '/images/destinations/uttarakhand.jpg', cities: ['Dehradun', 'Haridwar', 'Rishikesh'] },
    { name: 'West Bengal', description: 'The cultural capital of India.', image: '/images/destinations/west-bengal.jpg', cities: ['Kolkata', 'Darjeeling', 'Siliguri'] },
    { name: 'Delhi', description: 'The historic and modern capital.', image: '/images/destinations/delhi.jpg', cities: ['New Delhi', 'Old Delhi'] },
    { name: 'Ladakh', description: 'The land of high passes.', image: '/images/destinations/ladakh.jpg', cities: ['Leh', 'Kargil'] },
    { name: 'Jammu and Kashmir', description: 'Paradise on Earth.', image: '/images/destinations/jammu-and-kashmir.jpg', cities: ['Srinagar', 'Jammu', 'Anantnag'] }
  ];

  const stateMap: Record<string, any> = {};

  for (const s of statesData) {
    let state = await prisma.state.findUnique({ where: { name: s.name } });
    if (state) {
      state = await prisma.state.update({
        where: { id: state.id },
        data: { description: s.description, imageUrl: s.image }
      });
    } else {
      state = await prisma.state.create({
        data: { name: s.name, description: s.description, imageUrl: s.image }
      });
    }
    stateMap[s.name] = state;

    // Seed generic places for each major city
    for (const cityName of s.cities) {
      let existingCity = await prisma.city.findFirst({ where: { name: cityName, stateId: state.id } });
      if (!existingCity) {
        existingCity = await prisma.city.create({ data: { name: cityName, stateId: state.id } });
      }

      const placeName = `Explore ${cityName}`;
      let place = await prisma.place.findFirst({ where: { name: placeName, cityId: existingCity.id } });
      
      if (!place) {
        await prisma.place.create({
          data: {
            name: placeName,
            description: `Discover the amazing culture, food, and attractions of ${cityName}, located in ${s.name}.`,
            stateId: state.id,
            cityId: existingCity.id,
            categoryId: categoryMap['Cultural'].id,
            imageUrls: JSON.stringify([`/images/destinations/${cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}.jpg`]),
            bestTimeToVisit: 'October to March',
            isOffbeat: ['Ziro', 'Tawang', 'Silchar', 'Dibrugarh', 'Leh', 'Kargil'].includes(cityName)
          }
        });
      } else {
        await prisma.place.update({
          where: { id: place.id },
          data: { 
            imageUrls: JSON.stringify([`/images/destinations/${cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}.jpg`]),
            isOffbeat: ['Ziro', 'Tawang', 'Silchar', 'Dibrugarh', 'Leh', 'Kargil'].includes(cityName)
          }
        });
      }
    }
  }

  // Exact popular places
  const placesData = [
    { name: 'Taj Mahal', state: 'Uttar Pradesh', city: 'Agra', category: 'Heritage', desc: 'An ivory-white marble mausoleum on the right bank of the river Yamuna.', images: ['/images/destinations/taj-mahal.jpg'] },
    { name: 'Baga Beach', state: 'Goa', city: 'Panaji', category: 'Nature', desc: 'A popular beach and tourist destination in North Goa.', images: ['/images/destinations/baga-beach.jpg'] },
  ];

  for (const p of placesData) {
    const state = stateMap[p.state];
    if (!state) continue;

    let existingCity = await prisma.city.findFirst({ where: { name: p.city, stateId: state.id } });
    if (!existingCity) {
      existingCity = await prisma.city.create({ data: { name: p.city, stateId: state.id } });
    }
    const city = existingCity;

    const category = categoryMap[p.category];

    let place = await prisma.place.findFirst({ where: { name: p.name, stateId: state.id } });
    if (place) {
      await prisma.place.update({
        where: { id: place.id },
        data: { imageUrls: JSON.stringify(p.images) }
      });
    } else {
      await prisma.place.create({
        data: {
          name: p.name,
          description: p.desc,
          stateId: state.id,
          cityId: city.id,
          categoryId: category.id,
          imageUrls: JSON.stringify(p.images),
          bestTimeToVisit: 'October to March',
        }
      });
    }
  }

  console.log('Database seeded successfully with cities and places!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
