import { useTranslate } from 'i18n-calypso';
import { get } from 'lodash';
import ConversationsEmptyContent from 'calypso/blocks/conversations/empty';
import DocumentHead from 'calypso/components/data/document-head';
import FormattedHeader from 'calypso/components/formatted-header';
import Stream from 'calypso/reader/stream';
import ConversationsIntro from './intro';
import './stream.scss';

const emptyContent = () => <ConversationsEmptyContent />;

export default function ( props ) {
	const isInternal = get( props, 'store.id' ) === 'conversations-a8c';
	const intro = () => <ConversationsIntro isInternal={ isInternal } />;
	const translate = useTranslate();

	const ConversationTitle = () => {
		return (
			<DocumentHead
				title={ translate( '%s ‹ Reader', {
					args: props.title ?? 'Conversations',
					comment: '%s is the section name. For example: "My Likes"',
					textOnly: true,
				} ) }
			/>
		);
	};

	return (
		<>
			<FormattedHeader
				brandFont
				headerText={ translate( 'Conversations' ) }
				subHeaderText={ translate( 'Monitor all of your ongoing discussions.' ) }
				align="left"
				hasScreenOptions
				className="conversations-stream-header"
			/>
			<Stream
				key="conversations"
				streamKey={ props.streamKey }
				className="conversations__stream"
				followSource="conversations"
				useCompactCards={ true }
				trackScrollPage={ props.trackScrollPage }
				emptyContent={ emptyContent }
				intro={ intro }
			>
				<ConversationTitle title={ props.title } />
			</Stream>
		</>
	);
}
