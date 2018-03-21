# KIT ELO IOT

![ Placa ELO + Raspberry Zero W ](/images/kit_ELO1.PNG)
![ Placa ELO schematic ](/images/kit_ELO_SCH.png)

# PN532

**INTRODUÇÃO**

Este documento explica como utilizar o leitor NFC PN532 programando em Node.js.

### O que é NFC? 
>Near Field Communication
>É uma tecnologia que permite a troca de informações sem fio
>entre dispositivos, sendo necessária apenas uma aproximação
>física. A novidade teve origem no padrão RFID (Radio Frequency 
>Identification), mas se distanciou deste ao limitar o campo de 
>atuação de freqüências para uma distância de até 10 centímetros,
> objetivando tornar-se mais segura.

**ARQUIVOS NECESSÁRIOS**

Será necessário baixar a biblioteca modificada no github da elo-dev.

```sh
pi@raspberrypi:~ $ git clone https://github.com/cartaoelo/kit-iot.git
```

**INSTALAÇÃO**

O nodejs já vem instalado na raspberry em algumas imagens disponíveis no site do fabricante. Caso a versão do sistema operacional não possua o software instalado, deverá ser feita a instalação. Depois de instalar o nodejs, devemos instalar os pacotes npm necessários para que o exemplo funcione.
```sh
pi@raspberrypi:~ $ sudo apt-get install nodejs
pi@raspberrypi:~/kit-iot $ npm install --save
```

**DETECTANDO O PN532**

O PN532 será utilizado com comunicação i2c ligado no barramento padrão da raspberry  /dev/i2c-1. Para detectar o PN532 no barramento i2c será instalado o software i2c-tools. 

```sh
pi@raspberrypi:~ $ sudo apt-get install i2c-tools 
pi@raspberrypi:~ $ i2cdetect -y 1
    0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- 24 -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: 60 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- -- 
```

O endereço i2c do PN532 é 0x24, o outro endereço exibido no log do comando é o chip de autenticação ATECC508A também instalado no kit-iot da ELO.

**EXEMPLO**

Depois de clonar o diretório do projeto, basta rodar o código exemplo.
```sh
pi@raspberrypi:~/kit-iot $ node example.js
READY
Firmware:  { IC: 50, Ver: 1, Rev: 6, Support: 7 }
Listen for card read event ...
1516380276255 'UID:' '04:96:a5:89:ba:53:5b'
1516380276583 'UID:' '04:96:a5:89:ba:53:5b'
1516380276875 'UID:' '04:96:a5:89:ba:53:5b'
1516380277164 'UID:' '04:96:a5:89:ba:53:5b' 
```


# ATECC508A - CONFIGURAÇÃO

**INTRODUÇÃO**

Este documento explica como utilizar o software Cryptotronix EClet para configurar o chip Atmel ATECC508A em uma raspberry pi.

**ARQUIVOS NECESSÁRIOS**

Será necessário o download do driver:
https://github.com/cryptotronix/EClet

```sh
 pi@raspberrypi:~ $ git clone https://github.com/cryptotronix/EClet.git
```

**INSTALAÇÃO**

Instale build-essential, autotools-dev, automake, autoconf, libtool, libxml2-dev, check, texinfo, and libgcrypt (libgcrypt11-dev on Debian variants)

```sh
pi@raspberrypi:~ $ sudo apt-get install build-essential autotools-dev automake autoconf libtool libxml2-dev check texinfo libgcrypt11-dev
```

Após isso rode o arquivo ./autogen.sh . 

Isso irá gerar o arquivo README necessário a partir do arquivo README.md assim como a versão beta requerida da biblioteca baixada anteriormente.

```sh
pi@raspberrypi:~ $ sudo ./autogen.sh
pi@raspberrypi:~ $ sudo make install
```

**CONFIGURAÇÔES INICIAIS**

Você tera que ter acesso ao barramento i2c da Raspberry ` /dev/i2c* `. 

É possível mudar isto adicionando seu usuário para o grupo I2C utilizando: `sudo usermod -aG i2c user ` ou ` sudo chmod o+rw /dev/i2c* ` .

Lista de comandos:

**eclet state** : verifica se está em estado de fábrica.

```sh
pi@raspberrypi:~ $ eclet state
Factory 
```

**eclet  personalize** : em caso de sucesso este comando não retorna nada, sua função é configurar todos os slots (0-16) para a chave privada. 

O slot 8 é reservado para uso futuro. 

```sh
pi@raspberrypi:~ $ eclet personalize 
pi@raspberrypi:~ $ eclet state 
Personalized
```

**eclet  random** : Até que você tenha personalizado o seu dispositivo, o gerador de número aleatório irá retornar um número com padrões contendo FF e 00. 

```sh
pi@raspberrypi:~ $ eclet random
7E74FBFE17A10026124B092C9727416D6C28B38FA5D598E0711A9FCDFCDEC408 
```

**eclet  serial-num** : Retorna o serial do dispositivo.

```sh
pi@raspberrypi:~ $ eclet serial-num
0123XXXXXXXXXXXXEE
```

**eclet  gen-key** : Irá criar uma chave privada com 256 bits e irá retornar uma chave pública de formato 0x04 + X +Y. 

Caso o comando seja dado mais vezes a chave pública irá ser alterada.

```sh
pi@raspberrypi:~ $ eclet gen-key
042A02563C69C4CB5356BD8BBA96B1559D5FE799B6C497B128F42F8CB31FF751BF40361F0970DF48979B3E18A1039047299A1C3D7B809EAA2F844F0D75C479BDB9
```

**eclet  sign -f ChangeLog** : Cria uma assinatura ECDSA. 

O arquivo pode ser especificado com -f.

```sh
pi@raspberrypi:~/Eclet $ eclet sign -f ChangeLog 5D1BD52DD2294CA1518E2520CFBF518AD6DD48AA57978BCAF91919E51E5FE3CA2B1EFC8427AC7EC499DF340B197319545FCB``2A7F87D981F6712365CF3E6872B3
```

**eclet  verify** : Verifica a assinatura ECDSA usada no dispositivo. 

Se estiver correta, nada acontecerá, caso contrário é reportada uma mensagem de falha na verificação.

```sh
pi@raspberrypi:~/Eclet $ eclet verify -f ChangeLog -–signature 5D1BD52DD2294CA1518E2520CFBF518AD6DD48AA57978BCAF91919E51E5FE3CA2B1EFC8427AC7EC499DF340B197319545FCB2A7F87D981F6712365CF3E6872B3 -–public-key 04DD24F3770BD11A6A465F37D1D6CEEA58F8B8E1B85A5D3D665A0382BCBCDDC81321458F8A4FE5777BA0D508780A2476A23434B89BE2BBD5B8CF574348A15F1982
```

**eclet  offline-verify-sign** : Verifica a assinatura ECDSA usada, sem a necessidade do dispositivo. 

Se estiver correta, nada acontecerá, caso contrário é reportada uma mensagem de falha na verificação.

```sh
pi@raspberrypi:~/Eclet $ eclet offline-verify-sign -f ChangeLog -–signature 5D1BD52DD2294CA1518E2520CFBF518AD6DD48AA57978BCAF91919E51E5FE3CA2B1EFC8427AC7EC499DF340B197319545FCB2A7F87D981F6712365CF3E6872B3 -–public-key 04DD24F3770BD11A6A465F37D1D6CEEA58F8B8E1B85A5D3D665A0382BCBCDDC81321458F8A4FE5777BA0D508780A2476A23434B89BE2BBD5B8CF574348A15F1982
```

**OPÇÕES**

As opções podem ser visualizadas utilizando o comando –-help .

**LICENÇA**

Este produto é _**open source**_ de software distribuído sob a licença GPLv3 e hardware sob a licença CERN OHL v1.2!

EClet foi escrito por Cryptotronix, e distribuído sob licença GPLv3.
