# DHCPD

[DHCP Client States in the Lease Process](https://technet.microsoft.com/en-us/library/cc958935.aspx)



意義、用處
-----
```
DHCPD 就是 daemon of DHCP server

```

路徑
-----
```
/etc/dhcp/dhcpd.conf
```


code
-----
```
uncommented 這段 code

#authoritative

```

設置子網路區段
```
ex.1
subnet 192.168.1.0 netmask 255.255.255.0{
	range 192.168.1.5 192.168.1.10;
	default-lease-time 60;
	max-lease-time 120;
	
	option routers 192.168.1.1;
	option broadcast-address 192.168.1.255;
	option domain-name "local";
	option domain-name-server 8.8.8.8,8.8.4.4;
}

子網路區段 192.168.1.0 
子網路遮罩 255.255.255.0
option routers == net number == 本網段與其他網段的 gateway : 192.168.1.1
host number : 0 ~ 255
實際可分配的 host number IP : 192.168.100.5 ~ 192.168.100.10
subnet broadcast : 192.168.1.255
default lease time == 租借且不需更新租約的時間 : 60 秒
max lease time == 租借同一個 IP 的最長時間 : 120 秒


ex.2
subnet 192.168.100.0 netmask 255.255.255.0 {
  range 192.168.100.5 192.168.100.10;
  default-lease-time 600;
  max-lease-time 900;

  option routers 192.168.100.1;
  option broadcast-address 192.168.100.255;
  option domain-name "pi_local";
}

子網路區段 192.168.100.0
子網路遮罩 255.255.255.0
option routers == net number == 本網段與其他網段的 gateway : 192.168.100.1
host number : 0 ~ 255
實際可分配的 host number IP : 192.168.100.5 ~ 192.168.100.10
subnet broadcast : 192.168.100.255
default lease time == 租借且不需更新租約的時間 : 600 秒
max lease time == 租借同一個 IP 的最長時間 : 900 秒


```

### default-lease-time
### max-lease-time
![dhcpd-lease.jpg](./img/dhcpd-lease.jpg)

```
最大租約時間 ,
假設設定的條件為

default-lease-time : 300;
max-lease-time : 600;
 
預設的租約時間是 300 秒
最大的租約時間是 600 秒

default lease time 就是更新租約的時間 , 每 300 秒更新租約
max lease time 就是 IP 的租借時間 , 每次租借就是租借 600 秒的時間


意思就是 , 
假設當 dhcp client A 跟 DHCP server 發出 request , server 會發給  client 一個 IP 及註明租借時間 , client A 在 08:00:00 AM 取得一個 IP 192.168.1.8 ,

DHCP 會跟 A 有 lease , 如上圖;

那依照 max lease time 最大租借時間來看 , 不管 A 在 08:00:00 AM ~ 08:10:00 AM 這段期間 , A 離線又連線幾次 , A 都會保有這個 IP 的使用權利;

但是如果到 08:05:00 AM 到的時候 , A 還在繼續連線時 , DHCP server 就會跟 A 更新租約 , 新的租約會寫明起時時間跟終止時間
更新為 08:05:00 AM ~ 08:15:00 AM , A 還是繼續使用 192.168.1.8 這個 IP 毫無影響 ;

可是如果另外一種情況 , A 在租約到期之前就中途離線的話 , 
在 08:00:00 AM ~ 08:10:00 AM 的期間 IP 使用權一樣是屬於 A 的 ;

但是如果超過了 default lease time , 也就是 08:05:00 AM 之後時 ,
DHCP server 本來會找 A 續約 , 可是找不到 A 那就只能等待到最大租約時間到 ,

如果在最大租約期間到期之前 A 連線回來了 , 則會重新更新 lease , 開始時間跟終止時間就從更新的時間算 , 例如 08:07:30 AM 更新 , 那更新時間就是 08:07:30 AM ~ 08:17:30 AM , A 繼續保有同 IP 的使用權利;

可是如果在最大租約到了 , A 還沒連線發 request 給 DHCP server , 那 192.168.1.8 這個 IP 就會被 DHCP server 收回 pendding 等待下一個 DHCP client 使用

所以簡單的說

default lease time 就是更新租約的時間

max lease time 就是 IP 的租借時間


```


