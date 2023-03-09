import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutomatedTransferStatus } from 'calypso/state/automated-transfer/actions';
import { transferStates } from 'calypso/state/automated-transfer/constants';
import {
	getAutomatedTransferStatus,
	isFetchingAutomatedTransferStatus,
} from 'calypso/state/automated-transfer/selectors';

export const useCheckStagingSiteStatus = ( siteId: number ) => {
	const dispatch = useDispatch();

	const transferStatus = useSelector( ( state ) => getAutomatedTransferStatus( state, siteId ) );
	const isFetchingTransferStatus = useSelector( ( state ) =>
		isFetchingAutomatedTransferStatus( state, siteId )
	);

	useEffect( () => {
		if ( ! siteId || transferStatus === transferStates.COMPLETE ) {
			return;
		}

		let transferInterval: NodeJS.Timeout;

		if ( ! isFetchingTransferStatus ) {
			transferInterval = setInterval(
				() => dispatch( fetchAutomatedTransferStatus( siteId ) ),
				5000
			);
		}
		return () => {
			clearInterval( transferInterval );
		};
	}, [ siteId, dispatch, transferStatus, isFetchingTransferStatus ] );

	return transferStatus;
};