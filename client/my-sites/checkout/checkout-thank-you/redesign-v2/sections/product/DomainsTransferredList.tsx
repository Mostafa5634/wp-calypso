import { recordTracksEvent } from '@automattic/calypso-analytics';
import formatCurrency from '@automattic/format-currency';
import { joinClasses } from '@automattic/wpcom-checkout';
import { Button } from '@wordpress/components';
import { sprintf } from '@wordpress/i18n';
import { useI18n } from '@wordpress/react-i18n';
import { connect } from 'react-redux';
import { domainManagementRoot, domainManagementTransferIn } from 'calypso/my-sites/domains/paths';
import { getSiteSlug } from 'calypso/state/sites/selectors';
import type { ReceiptPurchase } from 'calypso/state/receipts/types';
import './style.scss';

type Props = {
	purchases: ReceiptPurchase[] | undefined;
	manageDomainUrl: string;
	currency?: string;
};

const DomainsTransferredList = ( { purchases, manageDomainUrl, currency = 'USD' }: Props ) => {
	const { __, _n } = useI18n();

	const handleUserClick = ( destination: string ) => {
		recordTracksEvent( 'calypso_domain_transfer_complete_click', {
			destination,
		} );
	};

	const purchaseLabel = ( priceInteger: number ) => {
		if ( priceInteger === 0 ) {
			return __( 'Free for one year' );
		}

		const priceFormatted = formatCurrency( priceInteger, currency, {
			stripZeros: true,
			isSmallestUnit: true,
		} );
		return sprintf(
			/* translators: %1$s: price formatted */
			__( '%1$s for one year' ),
			priceFormatted
		);
	};
	return (
		<>
			<div className="domain-header-buttons">
				<Button
					href="/setup/domain-transfer"
					onClick={ () => handleUserClick( '/setup/domain-transfer' ) }
					className="is-secondary"
				>
					{ __( 'Transfer more domains' ) }
				</Button>

				<Button
					href={ manageDomainUrl }
					className="manage-all-domains"
					onClick={ () => handleUserClick( '/domains/manage' ) }
					variant="primary"
				>
					{ _n( 'Manage your domain', 'Manage your domains', purchases?.length ?? 0 ) }
				</Button>
			</div>
			<div className="domain-complete-summary">
				<ul className="domain-complete-list">
					{ purchases?.map( ( { meta, priceInteger } ) => (
						<li
							className={ joinClasses( [
								'domain-complete-list-item',
								priceInteger === 0 && 'domain-complete-list-item-free',
							] ) }
							key={ meta }
						>
							<div>
								<h2>{ meta }</h2>
							</div>
							<p>{ purchaseLabel( priceInteger ) }</p>
						</li>
					) ) }
				</ul>
			</div>
		</>
	);
};

export default connect( ( state, ownProps: { purchases: ReceiptPurchase[] } ) => {
	let manageDomainUrl = '/domains/manage';
	if ( ownProps.purchases?.length === 1 ) {
		const { blogId, meta } = ownProps.purchases[ 0 ];
		const siteSlug = getSiteSlug( state, blogId );
		manageDomainUrl = domainManagementTransferIn( siteSlug ?? '', meta, domainManagementRoot() );
	}

	return {
		manageDomainUrl,
	};
} )( DomainsTransferredList );
