import { exec } from 'node:child_process';

const userAccessToken =
  'AQVY697wPHlRZg1e2fcB9qQZeQVTUKNhts51KNALxeBhwNPrt6qweIjO-ewRxl2psr-vD1_F5tM7bc6R53i7L9503-sa9sfYc5davZxylM1H7VD0_yie024Srb49yCqM99lXkgQHuJvXb2bG8o3leko-nS7Yu6hMnHCR4hcslFBtO2TVNksd6RXwm2DFEoqlPNdX4NZW_3ns7Q8N6SvlaCPPcvWui3-DS6QwGrHp5aVtbDkE0hOvHdxHx_oMBhSkexRyS-7Y91FxMy0dhwFK3Gt8QuXXfUNFeVqV4hUAL2gkcynfU0K3udbpyPz912Cwh-EwJy1s1BJH1e33-1E-M0uipPZA-w';

const userAccessTokenTwo =
  'AQVCIpzOfzDLc26tx5h7WckUghbCHXJ55_Fo35jgGQTts-NpX1k4kMgBzfkFdbXNk959uMq5qCUa6n995nAZnroJ5akos-e3KFa4lyfvT3QsmxCiuAysH8cttPPfR6kS6YFYDN5W9I163piydad8XExP6ZVgEAJ6MKyB2BOCSDlf2W5TyZYhk7WnEHgvtFdVlk4r8QwZYdLxSLhAzUmCPgVHhEwVHk7klAIMJ3GFeqOgiOKSnaTvhckjp0zzDam15QyNTgUzAvA7sPXlUzrN0vUX13DieastPQMJ18cXqY-TlljK8nMpiv5cQCMgHcnoWzjmVG-istHAoCbPoPy-wLZ6FUumWg';

async function initializeUpload() {
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
  /**
   * {
  uploadResult: {
    value: {
      uploadUrlExpiresAt: 1714907551588,
      uploadUrl: 'https://www.linkedin.com/dms-uploads/sp/D5610AQEAWPqabL7iNQ/ads-uploadedDocument/0?ca=vector_ads&cn=uploads&sync=0&v=beta&ut=3reOG2w9M06Hg1',
      document: 'urn:li:document:D5610AQEAWPqabL7iNQ'
  }
}
}
   */
}

async function uploadDocument(uploadUrl) {
  const command = `curl -i --upload-file ./resume-may-2024.pdf -H 'Authorization: Bearer ${userAccessTokenTwo}' ${uploadUrl}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });  // doc uploaded, now get the document
}

async function getDocument(docId) {
  // const docId = 'D5610AQEAWPqabL7iNQ';
  const getDocument = await fetch(`https://api.linkedin.com/rest/documents/urn:li:document:${docId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userAccessTokenTwo}`,
      'LinkedIn-Version': '202403'
    }
  });
  const getDocumentResult = await getDocument.json();
  console.log('getDocument', { getDocumentResult });
}

export async function linkedInAPI() {
  // const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: 'grant_type=client_credentials&client_id=86ydnkqy4tv89l&client_secret=zhKMZaWFTBIpfGaK'
  // });

  // const result = await response.json();

  // console.log(result);

  // const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
  //   headers: {
  //     Authorization: `Bearer ${userAccessToken}`
  //   }
  // });

  // const userInfo = await userInfoResponse.json();

  // console.log(userInfo);
  /**
   * {
  sub: 'i2-nsp_X8d',
  email_verified: true,
  name: 'Neeraj Kumar',
  locale: { country: 'US', language: 'en' },
  given_name: 'Neeraj',
  family_name: 'Kumar',
  email: 'ennkay161@gmail.com',
  picture: 'https://media.licdn.com/dms/image/D5603AQH0tonpcMv-DQ/profile-displayphoto-shrink_100_100/0/1714232773320?e=1720051200&v=beta&t=KjE119iSEwJfXoywRg9WGKOO4-sTzjxuWO_H71M2bgU'
}
   */

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

  const payloadTwo = {
    author: 'urn:li:person:i2-nsp_X8d',
    lifecycleState: 'PUBLISHED',
    specificContent: {
      shareCommentary: 'Hello World! This is a sample POST via LinkedIn API.',
      shareMediaCategory: 'NONE'
      // media: []
    },
    visibility: 'PUBLIC' // CONNECTIONS, PUBLIC
  };

  // const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${userAccessTokenTwo}`
  //   },
  //   body: JSON.stringify(payload)
  // });

  // const result = await postResponse.json();
  // console.log({ result });  // { result: { id: 'urn:li:share:7192473924339687424' } }

  // const file = fs.readFileSync('./resume-may-2024.pdf'); //fs.createReadStream('./resume-may-2024.pdf');
  // // fs.readFileSync('./resume-may-2024.pdf');
  // const form = new FormData();
  // form.append('file', file);

  // const options = {
  //   method: 'PUT',
  //   headers: {
  //     // 'Content-Type': 'application/pdf',
  //     Authorization: `Bearer ${userAccessTokenTwo}`
  //   },
  //   body: form
  // };
  // const url =
  // 'https://www.linkedin.com/dms-uploads/sp/D5610AQEAWPqabL7iNQ/ads-uploadedDocument/0?ca=vector_ads&cn=uploads&sync=0&v=beta&ut=3reOG2w9M06Hg1';
  // const documentUpload = await fetch(url, options);
  // const documentUploadResult = await documentUpload.json();
  // console.log(documentUploadResult);

  
  // const docId = 'D5610AQEAWPqabL7iNQ';
  // const getDocument = await fetch(`https://api.linkedin.com/rest/documents/urn:li:document:${docId}`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${userAccessTokenTwo}`,
  //     'LinkedIn-Version': '202403'
  //   }
  // });
  // const getDocumentResult = await getDocument.json();
  // console.log({ getDocumentResult });
  // {
  //   getDocumentResult: {
  //     downloadUrl: 'https://media.licdn.com/dms/document/media/D5610AQEAWPqabL7iNQ/ads-document-pdf-analyzed/0/1714821548487?e=1715428800&v=beta&t=meHQX8BFQEoLEyCmdWWjmlcMA-TlSY2ig219oSd0ez4',
  //     owner: 'urn:li:person:i2-nsp_X8d',
  //     id: 'urn:li:document:D5610AQEAWPqabL7iNQ',
  //     downloadUrlExpiresAt: 1715428800000,
  //     status: 'AVAILABLE'
  //   }
  // }

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
        id: `urn:li:document:${docId}`
      }
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  };

  // const postWithDocument = await fetch(`https://api.linkedin.com/rest/posts`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${userAccessTokenTwo}`,
  //     'LinkedIn-Version': '202403',
  //     'X-Restli-Protocol-Version': '2.0.0'
  //   },
  //   body: JSON.stringify(postDocBody)
  // });

  // const postWithDocumentResult = await postWithDocument.json();
  // console.log(JSON.stringify(postWithDocumentResult));

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


// stdout: HTTP/2 201 
// cache-control: no-cache, no-store
// pragma: no-cache
// expires: Thu, 01 Jan 1970 00:00:00 GMT
// set-cookie: lang=v=2&lang=en-us; SameSite=None; Path=/; Domain=linkedin.com; Secure
// set-cookie: bcookie="v=2&b3bb4d3a-0d45-4f4c-8aa7-a9e954b6be2c"; domain=.linkedin.com; Path=/; Secure; Expires=Sun, 04-May-2025 11:30:26 GMT; SameSite=None
// set-cookie: bscookie="v=1&202405041130269968c020-b7ff-4bc3-87c3-d800b0ce7ddeAQE9ZkIGi8oLGK0KKyENh7iJSDS8G1QM"; domain=.www.linkedin.com; Path=/; Secure; Expires=Sun, 04-May-2025 11:30:26 GMT; HttpOnly; SameSite=None
// set-cookie: lidc="b=VGST07:s=V:r=V:a=V:p=V:g=2935:u=1:x=1:i=1714822226:t=1714908626:v=2:sig=AQFrCAortJ0itNKJuszbSy9U0kmEzERz"; Expires=Sun, 05 May 2024 11:30:26 GMT; domain=.linkedin.com; Path=/; SameSite=None; Secure
// strict-transport-security: max-age=31536000
// x-content-type-options: nosniff
// x-frame-options: sameorigin
// content-security-policy: frame-ancestors 'self'
// x-li-fabric: prod-lva1
// x-li-pop: afd-prod-lva1-x
// x-li-proto: http/2
// x-li-uuid: AAYXnymojAE91iVrtrvTQQ==
// x-cache: CONFIG_NOCACHE
// x-msedge-ref: Ref A: 0D1E1C70109842589AD5F7713A5BEDE4 Ref B: DEL01EDGE0407 Ref C: 2024-05-04T11:30:26Z
// date: Sat, 04 May 2024 11:30:26 GMT
// content-length: 0