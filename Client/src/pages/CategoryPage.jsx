import React from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { menuData } from '@/data/menu';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useCart } from '@/contexts/CartContext';
    import { useToast } from '@/components/ui/use-toast';
    import { ArrowLeft, PlusCircle } from 'lucide-react';
    import FlavorDialog from '@/components/FlavorDialog';

    const CategoryPage = () => {
      const { categoryId } = useParams();
      const { addToCart } = useCart();
      const { toast } = useToast();
      const category = menuData.categories.find(c => c.id === categoryId);
      const items = menuData.items[categoryId] || [];

      if (!category) {
        return <div className="text-center py-10">Category not found.</div>;
      }

      const handleAddToCart = (item) => {
        const itemName = item.option ? `${item.name} (${item.option})` : item.name;
        addToCart(item);
        toast({
          title: "Added to cart!",
          description: `${itemName} is waiting for you.`,
        });
      };

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
        },
      };

      return (
        <>
          <Helmet>
            <title>{category.name} - Mellow Café</title>
            <meta name="description" content={`Browse our delicious ${category.name}.`} />
          </Helmet>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/" className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold mb-8">
                <ArrowLeft size={20} />
                Back to Menu
              </Link>
              <h1 className="text-4xl md:text-5xl font-extrabold text-red-500 tracking-tight">{category.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{category.description}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">{item.name}</CardTitle>
                      {item.size && <CardDescription>{item.size}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500">Stock: {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-yellow-600">₹{item.price}</p>
                      {item.options ? (
                        <FlavorDialog item={item} onAddToCart={handleAddToCart}>
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" disabled={item.stock === 0}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add
                          </Button>
                        </FlavorDialog>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      );
    };

    export default CategoryPage;