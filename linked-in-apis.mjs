import { exec } from 'node:child_process';

const userAccessToken =
  'AQVY697wPHlRZg1e2fcB9qQZeQVTUKNhts51KNALxeBhwNPrt6qweIjO-ewRxl2psr-vD1_F5tM7bc6R53i7L9503-sa9sfYc5davZxylM1H7VD0_yie024Srb49yCqM99lXkgQHuJvXb2bG8o3leko-nS7Yu6hMnHCR4hcslFBtO2TVNksd6RXwm2DFEoqlPNdX4NZW_3ns7Q8N6SvlaCPPcvWui3-DS6QwGrHp5aVtbDkE0hOvHdxHx_oMBhSkexRyS-7Y91FxMy0dhwFK3Gt8QuXXfUNFeVqV4hUAL2gkcynfU0K3udbpyPz912Cwh-EwJy1s1BJH1e33-1E-M0uipPZA-w';

const userAccessTokenTwo =
  'AQVCIpzOfzDLc26tx5h7WckUghbCHXJ55_Fo35jgGQTts-NpX1k4kMgBzfkFdbXNk959uMq5qCUa6n995nAZnroJ5akos-e3KFa4lyfvT3QsmxCiuAysH8cttPPfR6kS6YFYDN5W9I163piydad8XExP6ZVgEAJ6MKyB2BOCSDlf2W5TyZYhk7WnEHgvtFdVlk4r8QwZYdLxSLhAzUmCPgVHhEwVHk7klAIMJ3GFeqOgiOKSnaTvhckjp0zzDam15QyNTgUzAvA7sPXlUzrN0vUX13DieastPQMJ18cXqY-TlljK8nMpiv5cQCMgHcnoWzjmVG-istHAoCbPoPy-wLZ6FUumWg';

async function getUserInfo() {
  /* const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=86ydnkqy4tv89l&client_secret=zhKMZaWFTBIpfGaK'
  });

  const result = await response.json();
  console.log(result); */

  const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${userAccessToken}`
    }
  });

  const userInfo = await userInfoResponse.json();

  console.log(userInfo);
  /**
       * {
      sub: 'i2-nsp_X8d'  // This is our userid or author id, urn:li:person:i2-nsp_X8d,
      email_verified: true,
      name: 'Neeraj Kumar',
      locale: { country: 'US', language: 'en' },
      given_name: 'Neeraj',
      family_name: 'Kumar',
      email: 'ennkay161@gmail.com',
      picture: 'https://media.licdn.com/dms/image/D5603AQH0tonpcMv-DQ/profile-displayphoto-shrink_100_100/0/1714232773320?e=1720051200&v=beta&t=KjE119iSEwJfXoywRg9WGKOO4-sTzjxuWO_H71M2bgU'
    }
      */
}

async function publishPost() {
  // Publish a Post
  const payload = {
    author: 'urn:li:person:i2-nsp_X8d',
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: 'Hello World! This is a sample POST via LinkedIn API.'
        },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' // CONNECTIONS, PUBLIC
    }
  };

  const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAccessTokenTwo}`
    },
    body: JSON.stringify(payload)
  });

  const result = await postResponse.json();
  console.log({ result }); // { result: { id: 'urn:li:share:7192473924339687424' } }
}

async function initializeUpload() {
  // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api?view=li-lms-2024-04&tabs=curl#initialize-document-upload
  const uploadResponse = await fetch('https://api.linkedin.com/rest/documents?action=initializeUpload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAccessToken}`,
      'LinkedIn-Version': '202403',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: 'urn:li:person:i2-nsp_X8d'
      }
    })
  });
  const uploadResult = await uploadResponse.json();
  console.log({ uploadResult });
  return {
    uploadUrl: uploadResult.value.uploadUrl,
    document: uploadResult.value.document,
    uploadUrlExpiresAt: uploadResult.value.uploadUrlExpiresAt
  };
  /**
   * {
  uploadResult: {
    value: {
      uploadUrlExpiresAt: 1714912185439,
      uploadUrl: 'https://www.linkedin.com/dms-uploads/sp/D5610AQEeJbZob-cXYw/ads-uploadedDocument/0?ca=vector_ads&cn=uploads&sync=0&v=beta&ut=1YS6JPGcBd6Hg1',
      document: 'urn:li:document:D5610AQEeJbZob-cXYw'
    }
  }
}
   */
}

function uploadDocument(uploadUrl) {
  const command = `curl -i --upload-file ./resume-may-2024.pdf -H 'Authorization: Bearer ${userAccessTokenTwo}' "${uploadUrl}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  }); // doc uploaded, now get the document
}

async function getDocument(document) {
  // const docId = 'D5610AQEAWPqabL7iNQ';
  const getDocument = await fetch(`https://api.linkedin.com/rest/documents/${document}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userAccessTokenTwo}`,
      'LinkedIn-Version': '202403'
    }
  });
  const getDocumentResult = await getDocument.json();
  console.log('getDocument', { getDocumentResult });
}

async function makePostWithDocument(document) {
  // Now here is the main work, creating the Post with document
  // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api?view=li-lms-2024-04&tabs=curl#managing-document-content

  const postDocBody = {
    author: 'urn:li:person:i2-nsp_X8d',
    commentary: 'Hey There! Resume shared via LinkedIn API.',
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    content: {
      media: {
        title: 'Neeraj-Kumar-Resume-May-2024.pdf',
        id: `${document}`
      }
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  };

  const postWithDocument = await fetch(`https://api.linkedin.com/rest/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAccessTokenTwo}`,
      'LinkedIn-Version': '202403',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(postDocBody)
  });

  // console.log(postWithDocument);
  console.log(postWithDocument.status); // 201 | 401
  console.log(postWithDocument.statusText); // CREATED

  // const postWithDocumentResult = await postWithDocument.json();
  // console.log(JSON.stringify(postWithDocumentResult));
}

export async function linkedInAPI() {
  const { document, uploadUrl } = await initializeUpload();

  // const { document, uploadUrl } = {
  //   uploadUrl:
  //     'https://www.linkedin.com/dms-uploads/sp/D5610AQEeJbZob-cXYw/ads-uploadedDocument/0?ca=vector_ads&cn=uploads&sync=0&v=beta&ut=1YS6JPGcBd6Hg1',
  //   document: 'urn:li:document:D5610AQEeJbZob-cXYw'
  // };
  uploadDocument(uploadUrl);

  // await getDocument(document);

  await makePostWithDocument(document);
  

  // deletePost();
  async function deletePost() {
    const postId = 'urn:li:ugcPost:7192490890383220736';
    const deletePost = await fetch(`https://api.linkedin.com/rest/posts/7192490890383220736`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userAccessTokenTwo}`,
        'LinkedIn-Version': '202403',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    const deletePostResult = await deletePost.json();
    console.log({ deletePostResult });
  }
}

// Access Token
/**
 *
 * AQVY697wPHlRZg1e2fcB9qQZeQVTUKNhts51KNALxeBhwNPrt6qweIjO-ewRxl2psr-vD1_F5tM7bc6R53i7L9503-sa9sfYc5davZxylM1H7VD0_yie024Srb49yCqM99lXkgQHuJvXb2bG8o3leko-nS7Yu6hMnHCR4hcslFBtO2TVNksd6RXwm2DFEoqlPNdX4NZW_3ns7Q8N6SvlaCPPcvWui3-DS6QwGrHp5aVtbDkE0hOvHdxHx_oMBhSkexRyS-7Y91FxMy0dhwFK3Gt8QuXXfUNFeVqV4hUAL2gkcynfU0K3udbpyPz912Cwh-EwJy1s1BJH1e33-1E-M0uipPZA-w
 */
