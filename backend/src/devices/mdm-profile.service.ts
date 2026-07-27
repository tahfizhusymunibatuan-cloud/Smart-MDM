import { Injectable } from '@nestjs/common';

@Injectable()
export class MdmProfileService {
  generateAppleMdmProfile(deviceId: string, deviceName: string, restrictedApps: string[] = []) {
    // Generate valid XML .mobileconfig Apple MDM Payload
    const profileUuid = `smart-mdm-profile-${deviceId}`;
    const payloadUuid = `smart-mdm-payload-${deviceId}`;

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.applicationaccess</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.smartmdm.pondok.restrictions</string>
            <key>PayloadUUID</key>
            <string>${payloadUuid}</string>
            <key>PayloadDisplayName</key>
            <string>Pembatasan Jam Tidur & Belajar Smart MDM</string>

            <!-- Apple MDM Supervised Restrictions -->
            <key>allowAppRemoval</key>
            <false/>
            <key>allowExplicitContent</key>
            <false/>
            <key>allowCamera</key>
            <true/>
            <key>allowScreenShot</key>
            <true/>
            <key>blacklistedAppBundleIDs</key>
            <array>
                <string>com.zhiliaoapp.musically</string> <!-- TikTok -->
                <string>com.instagram.android</string>   <!-- Instagram -->
                <string>com.google.ios.youtube</string>  <!-- YouTube -->
            </array>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Smart MDM Pondok Enrollment Profile (${deviceName})</string>
    <key>PayloadIdentifier</key>
    <string>com.smartmdm.pondok.enrollment</string>
    <key>PayloadOrganization</key>
    <string>Pondok Pesantren Tahfizh Quran Al-Usymuni</string>
    <key>PayloadRemovalDisallowed</key>
    <true/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${profileUuid}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

    return xmlContent;
  }
}
