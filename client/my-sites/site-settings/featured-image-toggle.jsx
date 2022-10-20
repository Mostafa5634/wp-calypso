import { Card } from '@automattic/components';
import { ToggleControl } from '@wordpress/components';
import SettingsSectionHeader from 'calypso/my-sites/site-settings/settings-section-header';

const FeaturedImageTemplateToggle = ( props ) => {
	const { isRequestingSettings, isSavingSettings, fields, handleAutosavingToggle } = props;
	const isDisabled = isRequestingSettings || isSavingSettings;
	const settingName = 'featured_image_email_enabled';

	return (
		<div className="featured-image-template-toggle-settings">
			<SettingsSectionHeader
				id="featured-image-template-toggle-header"
				title="Featured Image" /* TODO: this will need to be translated */
			/>
			<Card className="featured-image-template-toggle-card">
				<ToggleControl /* TODO: Update props as needed. Currently the toggle does nothing */
					checked={ !! fields[ settingName ] }
					disabled={ isDisabled }
					onChange={ handleAutosavingToggle( settingName ) }
					label="Enable Featured image in the New Post email template" /* TODO: this will need to be translated */
				/>
			</Card>
		</div>
	);
};

/* TODO: connect export */
export default FeaturedImageTemplateToggle;