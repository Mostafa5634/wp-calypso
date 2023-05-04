import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callApi } from '../helpers';
import { useCacheKey, useIsLoggedIn } from '../hooks';
import type { SiteSubscriptionsPages } from '../types';

type SiteSubscriptionEmailMeNewPostsParams = {
	send_posts: boolean;
	blog_id: number | string;
};

type SiteSubscriptionEmailMeNewPostsResponse = {
	success: boolean;
	subscribed: boolean;
};

const useSiteEmailMeNewPostsMutation = () => {
	const { isLoggedIn } = useIsLoggedIn();
	const queryClient = useQueryClient();

	const siteSubscriptionsCacheKey = useCacheKey( [ 'read', 'site-subscriptions' ] );

	return useMutation(
		async ( params: SiteSubscriptionEmailMeNewPostsParams ) => {
			if ( ! params.blog_id || typeof params.send_posts !== 'boolean' ) {
				throw new Error(
					// reminder: translate this string when we add it to the UI
					'Something went wrong while changing the "Email me new posts" setting.'
				);
			}

			const action = params.send_posts ? 'new' : 'delete';

			const response = await callApi< SiteSubscriptionEmailMeNewPostsResponse >( {
				path: `/read/site/${ params.blog_id }/post_email_subscriptions/${ action }`,
				method: 'POST',
				body: {},
				isLoggedIn,
				apiVersion: '1.2',
			} );
			if ( ! response.success ) {
				throw new Error(
					// reminder: translate this string when we add it to the UI
					'Something went wrong while changing the "Email me new posts" setting.'
				);
			}

			return response;
		},
		{
			onMutate: async ( params ) => {
				await queryClient.cancelQueries( siteSubscriptionsCacheKey );

				const previousSiteSubscriptions =
					queryClient.getQueryData< SiteSubscriptionsPages >( siteSubscriptionsCacheKey );

				if ( previousSiteSubscriptions ) {
					queryClient.setQueryData( siteSubscriptionsCacheKey, {
						...previousSiteSubscriptions,
						pages: previousSiteSubscriptions.pages.map( ( page ) => {
							return {
								...page,
								subscriptions: page.subscriptions.map( ( siteSubscription ) => {
									if ( siteSubscription.blog_ID === params.blog_id ) {
										return {
											...siteSubscription,
											delivery_methods: {
												...siteSubscription.delivery_methods,
												email: {
													...siteSubscription.delivery_methods?.email,
													send_posts: params.send_posts,
												},
											},
										};
									}
									return siteSubscription;
								} ),
							};
						} ),
					} );
				}
				return { previousSiteSubscriptions };
			},

			onError: ( err, params, context ) => {
				if ( context?.previousSiteSubscriptions ) {
					queryClient.setQueryData( siteSubscriptionsCacheKey, context.previousSiteSubscriptions );
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries( [ 'read', 'site-subscriptions' ] );
			},
		}
	);
};

export default useSiteEmailMeNewPostsMutation;