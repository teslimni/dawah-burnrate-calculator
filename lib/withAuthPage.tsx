import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getUserFromRequest, DecodedUser } from './auth';

type WithAuthPageOptions = {
  redirectTo?: string;
};

export function withAuthPage(
  handler: (ctx: GetServerSidePropsContext, user: DecodedUser) => ReturnType<GetServerSideProps>,
  options: WithAuthPageOptions = {}
): GetServerSideProps {
  const { redirectTo = '/login' } = options;

  return async (ctx) => {
    const user = getUserFromRequest(ctx.req);

    if (!user) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: false,
        },
      };
    }

    return await handler(ctx, user);
  };
}
