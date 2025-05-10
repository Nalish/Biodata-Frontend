const core = require('@actions/core') // Helps with inputs and outputs
const exec = require('@actions/exec') // Helps with executing commands

async function run() {
    try {
        // Get inputs
        const vercelToken = core.getInput('vercel-token', { required: true })
        const distFolder = core.getInput('dist-folder', { required: true })

        // Deploy to Vercel
        await exec.exec(`npx vercel --prod --yes --token ${vercelToken} --cwd ${distFolder}`, [], options)

        // Set output for deployment URL
        const deployUrl = await getDeployUrl(distFolder, vercelToken)
        core.setOutput('deploy-url', deployUrl)
    } catch (error) {
        core.setFailed(error.message)
    }
}

async function getDeployUrl(distFolder, vercelToken) {
    let output = ''
    const options = {
        listeners: {
            stdout: (data) => {
                output += data.toString()
            }
        }
    }
    await exec.exec(`npx vercel --prod --token ${vercelToken} --cwd ${distFolder}`, [], options)
    const match = output.match(/https?:\/\/[^\s]+/g)
    return match ? match[0] : ''
}

run()
