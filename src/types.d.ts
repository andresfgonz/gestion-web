declare type SessionUser = {
  user: User;
  jwtToken: string;
};

declare interface User {
  id?: any;
  name: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  password?: string;
  roles?: { name: string }[];
  profileImage?: Image | string;
}

declare interface Chat {
  id?: any;
  createdAt: string;
  active: boolean;
  expired: boolean;
  user: User;
  supportUser: string | User;
}

declare interface ChatMessage {
  id?: any;
  chat: Chat;
  createdAt: string;
  sender: User;
  content: string;
}

declare interface Commerce {
  id?: any;
  name: string;
  tinNumber: string;
  logoImage: string;
}

declare interface Subsidiary {
  id?: any;
  name: string;
  address: string;
  personInCharge: User;
  commerce: Commerce;
}

declare interface Issue {
  id?: any;
  name: string;
}

declare interface Service {
  id?: any;
  status: string;
  creationComments: string;
  subsidiary: Subsidiary;
  issues: Issue[];
  active: boolean;
  technician?: User;
  scheduledTime?: Date;
  startedData?: {
    devicesToMaintain: string[];
    technicianComments: string;
  };
  finishedData?: {
    installedDevices: string[];
    retiredDevices: string[];

  };
}
