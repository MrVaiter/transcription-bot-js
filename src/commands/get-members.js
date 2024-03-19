const getMembers = (msg, client) => {
  const userList = msg.member.voice.channel.members
    .map((member) => [member.user.id, member.user.username])
    .filter((user) => user[1] != client.user.username);
  return userList;
};

export default getMembers;
