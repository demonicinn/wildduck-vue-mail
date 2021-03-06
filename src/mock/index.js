import Mock from 'mockjs';
import loginAPI from './login';
import inboxAPI from './inbox';
import outboxAPI from './outbox';
import draftboxAPI from './draftbox';
import mailDetailAPI from './mail_detail';
import mailLabelAPI from './mail_label';
import mailListAPI from './mail_list';
import groupAPI from './mail_group';
import contactsAPI from './mail_contacts';
import foldersAPI from './folder_owners_rights';
import foldersListAPI from './folder_list';

// Login related
Mock.mock(/\/login\/loginbyemail/, 'post', loginAPI.loginByEmail);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getInfo)

// Mail related
Mock.mock(/\/inbox\/list/, 'get', inboxAPI.getList);
Mock.mock(/\/outbox\/list/, 'get', outboxAPI.getList);
Mock.mock(/\/draftbox\/list/, 'get', draftboxAPI.getList);
Mock.mock(/\/contacts\/list/, 'get', contactsAPI.getList);
Mock.mock(/\/mail_detail/, 'get', mailDetailAPI.getDetail);
Mock.mock(/\/mail_label\/list/, 'get', mailLabelAPI.getList);
Mock.mock(/\/mail_list/, 'get', mailListAPI.getList);
Mock.mock(/\/mail_group\/list/, 'get', groupAPI.getList);
Mock.mock(/\/mail_contacts\/list/, 'get', contactsAPI.getList);

// Folder related
Mock.mock(/\/SetOwnersRightsForFolder \/list/, 'set', foldersAPI.setOwnerFolderRights);
Mock.mock(/\/SetOwnersRightsForFile \/list/, 'set', foldersAPI.setOwnerFileRights);
Mock.mock(/\/getFolderList \/list/, 'get', foldersListAPI.getList);

export default Mock;