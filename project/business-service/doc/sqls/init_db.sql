-----------------------------------------------------
-- Export file for user U_WJEWT                    --
-- Created by Administrator on 2018/1/30, 14:54:12 --
-----------------------------------------------------

create table SERVICE_DICTIONARY
(
  ID        VARCHAR2(50) not null,
  CODE      VARCHAR2(20),
  NAME      VARCHAR2(50),
  TYPE      VARCHAR2(20),
  ORDER_NUM INTEGER,
  ENABLE    VARCHAR2(1) default '1'
)
;
comment on table SERVICE_DICTIONARY
  is 'ҵ���ֵ��';
comment on column SERVICE_DICTIONARY.ID
  is '����ID';
comment on column SERVICE_DICTIONARY.CODE
  is '�ֵ����';
comment on column SERVICE_DICTIONARY.NAME
  is '�ֵ�����';
comment on column SERVICE_DICTIONARY.TYPE
  is '�ֵ�����';
comment on column SERVICE_DICTIONARY.ORDER_NUM
  is '�ֵ�����';
comment on column SERVICE_DICTIONARY.ENABLE
  is '��Ч��,0����Ч��1����Ч';
alter table SERVICE_DICTIONARY
  add constraint PK_SERVICE_DICTIONARY primary key (ID);

create table SERVICE_SYS_CONFIG
(
  ID     VARCHAR2(50) not null,
  KEY    VARCHAR2(20),
  VALUE  VARCHAR2(50),
  ENABLE VARCHAR2(1) default '1'
)
;
comment on table SERVICE_SYS_CONFIG
  is 'ϵͳƽ̨������Ϣ';
comment on column SERVICE_SYS_CONFIG.ID
  is '����ID';
comment on column SERVICE_SYS_CONFIG.KEY
  is '������';
comment on column SERVICE_SYS_CONFIG.VALUE
  is '������ֵ';
comment on column SERVICE_SYS_CONFIG.ENABLE
  is '��Ч��,0����Ч��1����Ч';
alter table SERVICE_SYS_CONFIG
  add constraint PK_SERVICE_SYS_CONFIG primary key (ID);

create table SERVICE_YJNC_APPLY
(
  ID                   VARCHAR2(50) not null,
  APPLYER_USER_ID      VARCHAR2(50),
  APPLYER_NAME         VARCHAR2(50),
  APPLYER_MOBILE       VARCHAR2(20),
  CAR_PLATE_TYPE       VARCHAR2(2),
  CAR_PLATE_NUM        VARCHAR2(10),
  DRIVER_MOBILE        VARCHAR2(20),
  DRIVER_NAME          VARCHAR2(50),
  ADDRESS              VARCHAR2(200),
  POINT_X              VARCHAR2(50),
  POINT_Y              VARCHAR2(50),
  REASON_TYPE          VARCHAR2(1),
  APPLY_TIME           DATE,
  LAST_UPDATE_USER     VARCHAR2(30),
  LAST_UPDATE_TIME     DATE,
  PICTURES             VARCHAR2(300),
  DRIVER_ATTITUDE_RANK VARCHAR2(1),
  DRIVER_SPEED_RANK    VARCHAR2(1),
  EVALUATE_CONTENT     VARCHAR2(1000),
  STATUS               VARCHAR2(1),
  APLLY_PLATEFORM      VARCHAR2(1),
  DELETE_STATE         VARCHAR2(1) default '0',
  SMS_OR_NOT           VARCHAR2(1),
  TEL_OR_NOT           VARCHAR2(1),
  PRESSED_OR_NOT       VARCHAR2(1)
)
;
comment on table SERVICE_YJNC_APPLY
  is 'һ��Ų�������';
comment on column SERVICE_YJNC_APPLY.ID
  is '����ID';
comment on column SERVICE_YJNC_APPLY.APPLYER_USER_ID
  is '�������û�ID';
comment on column SERVICE_YJNC_APPLY.APPLYER_NAME
  is '�����ύ������';
comment on column SERVICE_YJNC_APPLY.APPLYER_MOBILE
  is '�������ֻ���';
comment on column SERVICE_YJNC_APPLY.CAR_PLATE_TYPE
  is '�Ƴ����������ֵ�@PLATE_TYPE��1����ɫ���ƣ�С����������2����ɫ���ƣ�������������9����������';
comment on column SERVICE_YJNC_APPLY.CAR_PLATE_NUM
  is '�Ƴ����ƺ�,Ĭ��ֻ֧�ְ���ʡ �� ��ͷ�ĳ���';
comment on column SERVICE_YJNC_APPLY.DRIVER_MOBILE
  is '�����ֻ���';
comment on column SERVICE_YJNC_APPLY.DRIVER_NAME
  is '��������';
comment on column SERVICE_YJNC_APPLY.ADDRESS
  is '��λ��ַ�ı�';
comment on column SERVICE_YJNC_APPLY.POINT_X
  is '��λ����X';
comment on column SERVICE_YJNC_APPLY.POINT_Y
  is '��λ����Y';
comment on column SERVICE_YJNC_APPLY.REASON_TYPE
  is 'Ų��ԭ������ֵ�@REASON_TYPE��1����������������Ų����2�������Ŵ���δ�أ�3����Υ��ͣ������Ų����4������Ų����������';
comment on column SERVICE_YJNC_APPLY.APPLY_TIME
  is '�����ύʱ��,��������';
comment on column SERVICE_YJNC_APPLY.LAST_UPDATE_USER
  is '�������˵�¼��';
comment on column SERVICE_YJNC_APPLY.LAST_UPDATE_TIME
  is '������ʱ��,��������';
comment on column SERVICE_YJNC_APPLY.PICTURES
  is '�ֳ���Ƭ��Ϣ��������ţ��洢Fastdfs�ļ�·�������ţ�����';
comment on column SERVICE_YJNC_APPLY.DRIVER_ATTITUDE_RANK
  is '����Ų��̬�������ֵ�@EVALUATE_LEVEL,1:������2��������3������';
comment on column SERVICE_YJNC_APPLY.DRIVER_SPEED_RANK
  is '����Ų���ٶ������ֵ�@EVALUATE_LEVEL,1:������2��������3������';
comment on column SERVICE_YJNC_APPLY.EVALUATE_CONTENT
  is '��������';
comment on column SERVICE_YJNC_APPLY.STATUS
  is '�Ƴ�״̬�ֵ�@MOVE_STATUS��1����Ų����2��Ų���ɹ���3��Ų��ʧ�ܣ�4��������';
comment on column SERVICE_YJNC_APPLY.APLLY_PLATEFORM
  is '������Դƽ̨�ֵ�@APPLY_SOURCE��1��APP����׿��,2��APP��IOS����3��΢�Ź��ںţ�4��С����5��֧���������';
comment on column SERVICE_YJNC_APPLY.DELETE_STATE
  is 'ɾ��״̬,0��δɾ����1����ɾ�����߼�ɾ���ֶ�';
comment on column SERVICE_YJNC_APPLY.SMS_OR_NOT
  is '�Ƿ����֪ͨ,�ֵ� @YES_NO 0����1����';
comment on column SERVICE_YJNC_APPLY.TEL_OR_NOT
  is '�Ƿ�绰֪ͨ,�ֵ� @YES_NO 0����1����';
comment on column SERVICE_YJNC_APPLY.PRESSED_OR_NOT
  is '�Ƿ��Ѵ߰�,�ֵ� @YES_NO 0����1����';
alter table SERVICE_YJNC_APPLY
  add constraint PK_SERVICE_YJNC_APPLY primary key (ID);

create table SERVICE_YJNC_TASKS
(
  ID            VARCHAR2(50) not null,
  APPLY_ID      VARCHAR2(50),
  EVENT_NAME    VARCHAR2(50),
  EVENT_TYPE    VARCHAR2(20),
  TARGET_OBJECT VARCHAR2(100),
  EVENT_TIME    DATE,
  EVENT_STATUS  VARCHAR2(1),
  EVENT_CONTENT VARCHAR2(500)
)
;
comment on table SERVICE_YJNC_TASKS
  is 'һ��Ų�������';
comment on column SERVICE_YJNC_TASKS.ID
  is '����ID';
comment on column SERVICE_YJNC_TASKS.APPLY_ID
  is '����ID,�������������ID';
comment on column SERVICE_YJNC_TASKS.EVENT_NAME
  is '�¼�����';
comment on column SERVICE_YJNC_TASKS.EVENT_TYPE
  is '�¼����ͣ��ֵ�@EVENT_TYPE��1�������ţ�2����绰';
comment on column SERVICE_YJNC_TASKS.TARGET_OBJECT
  is '���������ֻ��Ż���΢�źŻ���QQ���������';
comment on column SERVICE_YJNC_TASKS.EVENT_TIME
  is '�¼�����ʱ��,��������';
comment on column SERVICE_YJNC_TASKS.EVENT_STATUS
  is '�¼����״̬  ״̬�ֵ�@EVENT_STATUS��1���ɹ���2��ʧ��';
comment on column SERVICE_YJNC_TASKS.EVENT_CONTENT
  is '�¼���������';
alter table SERVICE_YJNC_TASKS
  add constraint PK_SERVICE_YJNC_TASKS primary key (ID);

