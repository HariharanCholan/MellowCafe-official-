import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { menuData } from '@/data/menu';
    import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { ArrowRight } from 'lucide-react';

    const HomePage = () => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      };

      return (
        <>
          <Helmet>
            <title>Mellow Café - Home</title>
            <meta name="description" content="Welcome to Mellow Café! Explore our delicious menu." />
          </Helmet>
          <div className="bg-yellow-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-500 tracking-tight">Our Delicious Menu</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                  Explore a world of flavors, crafted with love and the finest ingredients.
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {menuData.categories.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <Link to={`/category/${category.id}`}>
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-yellow-400">
                        <div className="relative h-48">
                          <img 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt={category.name}
                           src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-red-500 group-hover:text-yellow-600 transition-colors">{category.name}</CardTitle>
                          <CardDescription className="flex items-center justify-between">
                            {category.description}
                            <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </>
      );
    };

    export default HomePage;