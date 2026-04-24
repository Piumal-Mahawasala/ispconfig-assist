const NodeSSH = require('node-ssh');
const { decrypt } = require('./crypto');

const sshConnections = {};

const createConnection = async (sshConfig) => {
  const ssh = new NodeSSH();
  
  try {
    await ssh.connect({
      host: sshConfig.host,
      username: sshConfig.username,
      privateKey: sshConfig.privateKeyPath,
      port: sshConfig.port || 22,
      readyTimeout: 30000,
      strictHostKeyChecking: false
    });
    
    return ssh;
  } catch (err) {
    throw new Error(`SSH Connection failed: ${err.message}`);
  }
};

const executeCommand = async (ssh, command) => {
  try {
    const result = await ssh.execCommand(command);
    return {
      success: result.code === 0,
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code
    };
  } catch (err) {
    throw new Error(`Command execution failed: ${err.message}`);
  }
};

const closeConnection = async (ssh) => {
  try {
    ssh.dispose();
  } catch (err) {
    console.error('Error closing SSH connection:', err);
  }
};

module.exports = {
  createConnection,
  executeCommand,
  closeConnection
};
