const core = require('@actions/core') // Helps with inputs and outputs
const exec = require('@actions/exec') // Helps with executing commands for uploading to S3

async function run() {
    try {
        // Get inputs
        const bucket = core.getInput('bucket', { required: true })
        const bucketRegion = core.getInput('bucket-region', { required: true })
        const distFolder = core.getInput('dist-folder', { required: true })

        // Upload files to S3
        const s3URI = `s3://${bucket}`
        await exec.exec(`aws s3 sync ${distFolder} ${s3URI} --region ${bucketRegion}`)

        // Set output for deployment URL
        const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`
        core.setOutput('website-url', websiteUrl)
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
