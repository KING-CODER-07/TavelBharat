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
    { name: 'Andhra Pradesh', description: 'Known for its rich cultural heritage and ancient temples.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop', cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati'] },
    { name: 'Arunachal Pradesh', description: 'The land of dawn-lit mountains.', image: 'https://images.unsplash.com/photo-1514222324005-4d69359e9a44?q=80&w=2070&auto=format&fit=crop', cities: ['Itanagar', 'Tawang', 'Ziro'] },
    { name: 'Assam', description: 'Famous for its tea gardens and wildlife.', image: 'https://images.unsplash.com/photo-1623547169420-94e82367d643?q=80&w=1974&auto=format&fit=crop', cities: ['Guwahati', 'Silchar', 'Dibrugarh'] },
    { name: 'Bihar', description: 'The cradle of history and culture.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2069&auto=format&fit=crop', cities: ['Patna', 'Gaya', 'Bhagalpur'] },
    { name: 'Goa', description: 'Famous for its pristine beaches and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop', cities: ['Panaji', 'Vasco da Gama', 'Margao'] },
    { name: 'Gujarat', description: 'Home to the Asiatic lion and vast salt deserts.', image: 'https://images.unsplash.com/photo-1564507592227-0b0b5c0658e7?q=80&w=2070&auto=format&fit=crop', cities: ['Ahmedabad', 'Surat', 'Vadodara'] },
    { name: 'Himachal Pradesh', description: 'Spectacular mountains and valleys.', image: 'https://images.unsplash.com/photo-1506461883276-594c397e41d8?q=80&w=2071&auto=format&fit=crop', cities: ['Shimla', 'Manali', 'Dharamshala'] },
    { name: 'Karnataka', description: 'A mix of modern technology and ancient ruins.', image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=1974&auto=format&fit=crop', cities: ['Bengaluru', 'Mysuru', 'Hubli'] },
    { name: 'Kerala', description: 'God\'s own country.', image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2070&auto=format&fit=crop', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'] },
    { name: 'Madhya Pradesh', description: 'The heart of India.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop', cities: ['Indore', 'Bhopal', 'Jabalpur'] },
    { name: 'Maharashtra', description: 'Land of diverse cultures and bustling cities.', image: 'https://images.unsplash.com/photo-1596280456247-2b0ce818c4bd?q=80&w=2070&auto=format&fit=crop', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Punjab', description: 'The land of five rivers.', image: 'https://images.unsplash.com/photo-1621271168478-f7b57b9876e5?q=80&w=2070&auto=format&fit=crop', cities: ['Ludhiana', 'Amritsar', 'Jalandhar'] },
    { name: 'Rajasthan', description: 'The land of Kings.', image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=2069&auto=format&fit=crop', cities: ['Jaipur', 'Udaipur', 'Jodhpur'] },
    { name: 'Tamil Nadu', description: 'Land of temples and traditions.', image: 'https://images.unsplash.com/photo-1600100397608-f010f423b971?q=80&w=1974&auto=format&fit=crop', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
    { name: 'Uttar Pradesh', description: 'Home to the majestic Taj Mahal.', image: 'https://images.unsplash.com/photo-1560086884-a15d742eb5e2?q=80&w=2070&auto=format&fit=crop', cities: ['Lucknow', 'Kanpur', 'Agra'] },
    { name: 'Uttarakhand', description: 'Devbhumi, the land of the gods.', image: 'https://images.unsplash.com/photo-1599587425175-103bc4c40026?q=80&w=1935&auto=format&fit=crop', cities: ['Dehradun', 'Haridwar', 'Rishikesh'] },
    { name: 'West Bengal', description: 'The cultural capital of India.', image: 'https://images.unsplash.com/photo-1622308644420-b8fc322db12a?q=80&w=2070&auto=format&fit=crop', cities: ['Kolkata', 'Darjeeling', 'Siliguri'] },
    { name: 'Delhi', description: 'The historic and modern capital.', image: 'https://images.unsplash.com/photo-1589308078059-be1415e143b4?q=80&w=2070&auto=format&fit=crop', cities: ['New Delhi', 'Old Delhi'] },
    { name: 'Ladakh', description: 'The land of high passes.', image: 'https://images.unsplash.com/photo-1600021612760-4927f8a9e701?q=80&w=1969&auto=format&fit=crop', cities: ['Leh', 'Kargil'] },
    { name: 'Jammu and Kashmir', description: 'Paradise on Earth.', image: 'https://images.unsplash.com/photo-1616035251508-b7a602ffc425?q=80&w=2070&auto=format&fit=crop', cities: ['Srinagar', 'Jammu', 'Anantnag'] }
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
            imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1557088911-30cb41c7b1bc?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1533423996375-f914b1ce6d56?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1643881476901-52ab53fcc251?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1524311583145-d5593bd2602a?q=80&w=2071&auto=format&fit=crop"]),
            bestTimeToVisit: 'October to March',
            isOffbeat: ['Ziro', 'Tawang', 'Silchar', 'Dibrugarh', 'Leh', 'Kargil'].includes(cityName)
          }
        });
      } else {
        await prisma.place.update({
          where: { id: place.id },
          data: { 
            imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1517427677506-ade074eb1432?q=80&w=1974&auto=format&fit=crop","https://images.unsplash.com/photo-1506461883276-594c397e41d8?q=80&w=2071&auto=format&fit=crop","https://images.unsplash.com/photo-1606558485292-6f29633c7f99?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1583275095033-7281bc8836ec?q=80&w=1934&auto=format&fit=crop"]),
            isOffbeat: ['Ziro', 'Tawang', 'Silchar', 'Dibrugarh', 'Leh', 'Kargil'].includes(cityName)
          }
        });
      }
    }
  }

  // Exact popular places
  const placesData = [
    { name: 'Taj Mahal', state: 'Uttar Pradesh', city: 'Agra', category: 'Heritage', desc: 'An ivory-white marble mausoleum on the right bank of the river Yamuna.', images: ["https://images.unsplash.com/photo-1585675402633-86d11f62bbf0?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1598324789736-4861f89564a0?q=80&w=1974&auto=format&fit=crop","https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop","https://images.unsplash.com/photo-1514222324005-4d69359e9a44?q=80&w=2070&auto=format&fit=crop"] },
    { name: 'Baga Beach', state: 'Goa', city: 'Panaji', category: 'Nature', desc: 'A popular beach and tourist destination in North Goa.', images: ["https://images.unsplash.com/photo-1623547169420-94e82367d643?q=80&w=1974&auto=format&fit=crop","https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2069&auto=format&fit=crop","https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop","https://images.unsplash.com/photo-1564507592227-0b0b5c0658e7?q=80&w=2070&auto=format&fit=crop"] },
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
