const _ = require('lodash');
const fs = require('fs');
const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

templateHandler = () => {
const GetTemplates = {
  method: 'GET',
  url: '/v3/templates?generations=dynamic'
}

client.request(GetTemplates)
 .then(([response, body]) => {
    //console.log(response.statusCode);
    //console.log(response.body.templates);
    _.chain(response.body.templates)
    .map( function (value) {
    //  console.log(value)
      templateInfo = {
        templateId: _.get(value, 'id'),
        templateVersionId: _.get(value, 'versions[0].id'),
        templateName: _.get(value, 'name')
      } 
      // console.log(templateInfo)
      updateTemplate(templateInfo)
    })
    .value()
  })
}

updateTemplate = (templateInfo) => {

const templateId = templateInfo.templateId
const versionId = templateInfo.templateVersionId
const fileName = `${templateInfo.templateName}.html`
console.log(`Update template: ${fileName}`)
if (fs.existsSync(fileName)) {
  var data = fs.readFileSync(fileName,'utf-8');
  const templateData = {
    "active": 1, 
    "html_content": `${data}`,
    "name": fileName,
    "generate_plain_content": true,
    "subject": "{{{subject}}}"
  }
  
  const UpdateTemplate = {
    method: 'PATCH',
    body: templateData,
    url: `/v3/templates/${templateId}/versions/${versionId}`
  }
  // console.log(UpdateTemplate)
  client.request(UpdateTemplate)
  .catch((e) => {
    console.log(e)
  })
    //  .then(([response, body]) => {
    //   //  console.log(response.statusCode);
    //    console.log(body);
    //  })
}




}

templateHandler()
