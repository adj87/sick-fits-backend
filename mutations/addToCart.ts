import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
) {
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this!');
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },

    resolveFields: 'id, quantity',
  });

  const [existingCartItem] = allCartItems;
  console.log('session', session);
  console.log('allcartitems', JSON.stringify(allCartItems));
  console.log('productId', productId);
  if (existingCartItem) {
    console.log('This item are already ${}');
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
}
