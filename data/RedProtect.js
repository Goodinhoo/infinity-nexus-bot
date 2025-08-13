const data = [
    {
        title: "Gerenciamento de Membros",
        lista: [
            {
                command: "/rp addadmin",
                alias: "aa",
                description: "Promover um membro a admin"
            },
            {
                command: "/rp addleader",
                alias: "al",
                description: "Promover um admin ou membro a líder"
            },
            {
                command: "/rp addmember",
                alias: "am",
                description: "Adicionar um membro a uma região"
            },
            {
                command: "/rp removemember",
                alias: "rm",
                description: "Remover um jogador da região"
            },
            {
                command: "/rp removeadmin",
                alias: "ra",
                description: "Rebaixar um admin para membro"
            },
            {
                command: "/rp removeleader",
                alias: "rl",
                description: "Rebaixar um jogador de líder para admin na região"
            }
        ]
    },
    {
        title: "Gerenciamento de Regiões",
        lista: [
            {
                command: "/rp pos1",
                alias: "p1",
                description: "Definir a primeira posição como ferramenta de varinha (se usando o tipo varinha)"
            },
            {
                command: "/rp pos2",
                alias: "p2",
                description: "Definir a segunda posição como ferramenta de varinha (se usando o tipo varinha)"
            },
            {
                command: "/rp claim [regionName]",
                alias: "cla",
                description: "Reivindicar uma região usando a ferramenta de varinha como jogador"
            },
            {
                command: "/rp define",
                alias: "def",
                description: "Criar nova região com ferramenta de varinha como #server#"
            },
            {
                command: "/rp redefine",
                alias: "rdef",
                description: "Redefinir a área de uma região com ferramenta de varinha"
            },
            {
                command: "/rp priority",
                alias: "prior",
                description: "Definir a prioridade para regiões filhas"
            },
            {
                command: "/rp rename",
                alias: "rn",
                description: "Renomear uma região"
            },
            {
                command: "/rp deltp",
                alias: "dtp",
                description: "Deletar um ponto de teletransporte da região"
            },
            {
                command: "/rp info [region] [world]",
                alias: "i",
                description: "Obter informações sobre uma região"
            },
            {
                command: "/rp border",
                alias: "b",
                description: "Mostrar a fronteira da região"
            },
            {
                command: "/rp flag [flag] [value]",
                alias: "fl",
                description: "Abrir um GUI visual de bandeira ou alterar o valor de uma bandeira"
            },
            {
                command: "/rp welcome <message/off/hide>",
                alias: "wel",
                description: "Definir uma mensagem de boas-vindas ao entrar na região"
            },
            {
                command: "/rp kick",
                alias: "k",
                description: "Expulsar um jogador e negar temporariamente a entrada deste jogador na região"
            },
            {
                command: "/rp delete",
                alias: "del",
                description: "Deletar uma região"
            }
        ]
    },
    {
        title: "Limites de Blocos e Regiões",
        lista: [
            {
                command: "/rp blocklimit [other player]",
                alias: "blimit",
                description: "Ver os limites de blocos"
            },
            {
                command: "/rp claimlimit [other player]",
                alias: "cl",
                description: "Ver o limite de reivindicações"
            },
            {
                command: "/rp addblock [player] [amount]",
                alias: "ab",
                description: "Adicionar limite de blocos ao jogador"
            },
            {
                command: "/rp delblock [player] [amount]",
                alias: "db",
                description: "Remover limite de blocos do jogador"
            }
        ]
    },
    {
        title: "Comandos Úteis",
        lista: [
            {
                command: "/rp help",
                alias: "?",
                description: "Mostrar página de ajuda"
            },
            {
                command: "/rp start",
                alias: "st",
                description: "Colar um esquema inicial para novos jogadores"
            },
            {
                command: "/rp tutorial",
                alias: "tut",
                description: "Mostrar um tutorial sobre como proteger uma região"
            },
            {
                command: "/rp list",
                alias: "ls",
                description: "Visualizar todas as suas regiões"
            },
            {
                command: "/rp near",
                alias: "n",
                description: "Listar regiões próximas"
            },
            {
                command: "/rp wand",
                alias: "w",
                description: "Obter a ferramenta Varinha se estiver usando o modo de reivindicação WAND"
            },
            {
                command: "/rp value",
                alias: "v",
                description: "Calcula o valor da região com base na configuração do arquivo de economia"
            }
        ]
    },
    {
        title: "Comandos de Admin ou Mod",
        lista: [
            {
                command: "/rp can-purge",
                alias: "cp",
                description: "Ativar limpeza para uma região"
            },
            {
                command: "/rp copyflag [from] [to]",
                alias: "cf",
                description: "Copiar flags de uma região para outra"
            },
            {
                command: "/rp expand-vert [regionName] [world]",
                alias: "ev",
                description: "Expandir uma região para a altura mínima e máxima do mundo"
            },
            {
                command: "/rp kill [world] [entity]",
                alias: "kill",
                description: "Matar todas as entidades em todos os mundos, ou específico"
            },
            {
                command: "/rp purge-limit",
                alias: "pl",
                description: "Verificar o limite de regiões de limpeza desativadas"
            },
            {
                command: "/rp regen/undo",
                alias: "regen",
                description: "Regenerar uma região ou desfazer uma região regenerada. [[Clique Aqui]]"
            },
            {
                command: "/rp regenall",
                alias: "regall",
                description: "Regenerar todas as regiões de um jogador"
            },
            {
                command: "/rp select-we",
                alias: "swe",
                description: "Fazer uma seleção de edição do mundo com base na ferramenta de varinha RedProtect"
            },
            {
                command: "/rp setmaxy/setminy",
                alias: "maxy/miny",
                description: "Definir alturas da região"
            },
            {
                command: "/rp settp",
                alias: "stp",
                description: "Definir o ponto de tp de uma região"
            },
            {
                command: "/rp teleport [region] [world]",
                alias: "tp",
                description: "Teletransportar para uma região"
            }
        ]
    },
    {
        title: "Criação de Portal",
        lista: [
            {
                command: "/rp createportal",
                alias: "newportal",
                description: "Para criar um portal usando a ferramenta de varinha ou a partir de uma região existente"
            }
        ]
    },
    {
        title: "Comandos de Console",
        descricao: "Estes comandos são para administração, gestão e testes em um servidor RedProtected. Estes comandos precisam ser usados a partir do console ou com a permissão \"redprotect.admin\".",
        lista: [
            {
                command: "/rp addon [addon name] [download/enable/disable]",
                description: "Instale addons da nuvem e pode carregar/descarregar (necessita do plugin PlugManX para descarregar/carregar o addon sem reiniciar o servidor)"
            },
            {
                command: "/rp debug-item",
                description: "Imprime o nome do material na mão do jogador no chat para usar nas configurações do redprotect"
            },
            {
                command: "/rp reset-uuids",
                description: "Atualize e redefina os UUIDs dos jogadores com base na Mojang (se em modo online) ou nos uuids offline dos jogadores"
            },
            {
                command: "/rp test-uuid [player name]",
                description: "Teste o uuid do jogador para comparar o uuid da Mojang e o uuid do servidor"
            },
            {
                command: "/rp clear-kicks",
                description: "Redefinir todos os tempos atuais de expulsão de jogadores"
            },
            {
                command: "/rp single-to-files",
                description: "Converter cada arquivo único para um arquivo de região por mundo"
            },
            {
                command: "/rp files-to-single",
                description: "Converter arquivos de regiões do mundo para cada arquivo de região"
            },
            {
                command: "/rp fileToMysql",
                description: "Converter base de dados de arquivo para Mysql. As configurações do Mysql precisam ser definidas na configuração antes de usar este comando"
            },
            {
                command: "/rp mysqlToFile",
                description: "Converter base de dados Mysql para arquivos"
            },
            {
                command: "/rp gpTorp",
                description: "Converter regiões de GriefPrevention para redprotect"
            },
            {
                command: "/rp mychunktorp",
                description: "Converter regiões de MyChunk para redprotect"
            },
            {
                command: "/rp wgtorp",
                description: "Converter regiões de WorldGuard para redprotect"
            },
            {
                command: "/rp list-all",
                description: "Imprime todas as regiões no console"
            },
            {
                command: "/rp load-all",
                description: "Sobrescreve todas as regiões na memória com as regiões salvas do disco"
            },
            {
                command: "/rp save-all",
                description: "Salvar todas as regiões no disco"
            },
            {
                command: "/rp reload",
                description: "Desativar e reativar redprotect recarregando regiões e configurações"
            },
            {
                command: "/rp reload-config",
                description: "Recarregar todos os arquivos de configuração do disco"
            }
        ]
    },

]


module.exports = data;