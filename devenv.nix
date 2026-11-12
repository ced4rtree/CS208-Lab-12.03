{ pkgs, lib, config, inputs, ... }: {
  languages.javascript = {
    enable = true;
    nodejs.enable = true;
    lsp.enable = true;
    npm.enable = true;
  };

  services.mysql = {
    enable = true;
    ensureUsers = [
      {
        name = "root";
        password = "12345";
        ensurePermissions = {
          "root.*" = "ALL PRIVILEGES";
        };
      }
    ];
  };
}
