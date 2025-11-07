import React from 'react';
import type { Page } from '../types';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';

interface LegalScreenProps {
  page: Page;
}

const content = {
    Privacy: {
        title: "Privacy Policy",
        text: "This app is password-protected to ensure the privacy and security of our users. Only verified users can access the full range of features. We are committed to protecting your data and will not share it with third parties. All user-generated content is processed securely."
    },
    Copyright: {
        title: "Copyright Notice",
        text: "All content, features, and intellectual property within the Dav Med App are © David Niyonzima. Unauthorized use, reproduction, or distribution of any part of this application is strictly prohibited and may result in legal action."
    }
}

export const LegalScreen: React.FC<LegalScreenProps> = ({ page }) => {
  const type = page.props?.type as 'Privacy' | 'Copyright' || 'Privacy';
  const legalContent = content[type];
  
  return (
    <PageWrapper page={page}>
      <Card>
        <div className="prose max-w-none">
            <h2>{legalContent.title}</h2>
            <p>{legalContent.text}</p>
        </div>
      </Card>
    </PageWrapper>
  );
};