NETWORKS		=	$$(docker network ls -q --filter "type=custom")
IMAGES			=	$$(docker image ls -aq)
VOLUMES			=	$$(docker volume ls -q)
CONTAINERS		=	$$(docker ps -aq)
COMPOSEFILE		=	buildTools/docker-compose.yml
GREEN			=	\033[0;32m
RESET			=	\033[0m
cols			=	$$(tput cols)
SE				=	$$(printf "%-$(cols)s" "_" | tr ' ' '_')
PROJECTNAME		=	pong

all: up in

up:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@ -d
down:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@
build:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@
ps:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@ --all
top:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@
stop:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@
restart:
	@docker --log-level=error compose -f $(COMPOSEFILE) $@
in:
	@docker --log-level=error exec -it $(PROJECTNAME) zsh
load:
	@docker --log-level=error load -i buildTools/web_app.tar

ls:
	@echo $(SE) && docker --log-level=error images && echo $(SE) && docker --log-level=error ps --all
	@echo $(SE) && docker --log-level=error volume ls && echo $(SE) && docker --log-level=error network ls --filter "type=custom"

cleancontainers:
	@echo -n " ✔ cleaning containers ..."
	@docker --log-level=error stop $(CONTAINERS) > /dev/null 2>&1 || true
	@docker --log-level=error rm -f $(CONTAINERS) > /dev/null 2>&1 || true
	@echo "$(GREEN)\tDone$(RESET)"
cleanimages:
	@echo -n " ✔ cleaning images ..."
	@docker --log-level=error image rm -f $(IMAGES) > /dev/null 2>&1 || true
	@echo "$(GREEN)\t\tDone$(RESET)"
cleannetworks:
	@echo -n " ✔ cleaning networks ..."
	@docker --log-level=error network rm -f $(NETWORKS) > /dev/null 2>&1 || true
	@echo "$(GREEN)\tDone$(RESET)"
cleanvolumes:
	@echo -n " ✔ cleaning volumes ..."
	@docker --log-level=error volume rm -f $(VOLUMES) > /dev/null 2>&1 || true
	@echo "$(GREEN)\t\tDone$(RESET)"

clean:
	@docker --log-level=error compose -f $(COMPOSEFILE) down -v

fclean: cleancontainers cleannetworks cleanvolumes

prune: cleancontainers cleannetworks cleanvolumes cleanimages
	@echo -n " ✔ system prune ..."
	@docker --log-level=error system prune --all --force > /dev/null 2>&1 || true
	@echo "$(GREEN)\t\tDone$(RESET)"

re: clean up in

.PHONY: in up down build ps top stop restart ls cleancontainers cleanimages cleannetworks cleanvolumes clean fclean prune re
