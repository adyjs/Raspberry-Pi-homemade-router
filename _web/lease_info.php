<?php

$lease = shell_exec("sudo service isc-dhcp-server restart && sleep 1 && cat /var/lib/dhcp/dhcpd.leases");
echo $lease;
?>