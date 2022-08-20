using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Acciones.Controllers
{
    public class AsociacionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public AsociacionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Asociaciones
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var dbAccionesContext = _context.Asociaciones.Include(a => a.Calle).Include(a => a.Colonia);
            ViewBag.JavaScriptFunction = string.Format("FiltraAsociaciones();");
            return View(await dbAccionesContext.ToListAsync());
        }

        public IActionResult DetalleAsociacion(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewBag.JavaScriptFunction = string.Format("muestraDetalleAsociacion(" + id +");");
            return View();
        }

        // GET: Asociaciones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var asociacione = await _context.Asociaciones
                .Include(a => a.Calle)
                .Include(a => a.Colonia)
                .FirstOrDefaultAsync(m => m.AsociacionId == id);
            if (asociacione == null)
            {
                return NotFound();
            }

            return View(asociacione);
        }

        // GET: Asociaciones/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            return View();
        }

        // POST: Asociaciones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AsociacionId,Nombre,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Asociacione asociacione)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                _context.Add(asociacione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);
            return View(asociacione);
        }

        // GET: Asociaciones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var asociacione = await _context.Asociaciones.FindAsync(id);
            if (asociacione == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);

            ViewData["ColoniaVD"] = _context.Colonias.Where(c => c.ColoniaId == asociacione.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault();
            ViewData["CalleVD"] = _context.Calles.Where(c => c.ColoniaId == asociacione.ColoniaId).Select(c => c.NombreCalle).FirstOrDefault();

            ViewBag.JavaScriptFunction = string.Format("MuestraComplementoAsociacion(" + id + ");");
            return View(asociacione);
        }

        // POST: Asociaciones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AsociacionId,Nombre,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Asociacione asociacione)
        {
            if (id != asociacione.AsociacionId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(asociacione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AsociacioneExists(asociacione.AsociacionId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", asociacione.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", asociacione.ColoniaId);
            return View(asociacione);
        }

        // GET: Asociaciones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var asociacione = await _context.Asociaciones
                .Include(a => a.Calle)
                .Include(a => a.Colonia)
                .FirstOrDefaultAsync(m => m.AsociacionId == id);
            if (asociacione == null)
            {
                return NotFound();
            }

            return View(asociacione);
        }

        // POST: Asociaciones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var asociacione = await _context.Asociaciones.FindAsync(id);
            _context.Asociaciones.Remove(asociacione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AsociacioneExists(int id)
        {
            return _context.Asociaciones.Any(e => e.AsociacionId == id);
        }


        /************************************************************
            Inserta Nueva Asociación
        *************************************************************/
        [HttpPost]
        public int InsertaNuevaAsociacion(string nombre, int coloniaId, int calleId, string numExterior, string numInterior, int cp, string email, string telefono, string latitud, string longitud, string notas)
        {
            int diputadoId = 8;
            if (BuscaAsociacionXnombre(nombre) > 0)       //  Verifica que no exista otra ASOCIACÓN con el mismo nombre
            {
                return 0;
            }

            Asociacione asociacion = new Asociacione();
            asociacion.Nombre = nombre;
            asociacion.ColoniaId = coloniaId;
            asociacion.CalleId = calleId;
            asociacion.NumExterior = numExterior;
            asociacion.NumInterior = numInterior;
            asociacion.Cp = cp;
            asociacion.Email = email;
            asociacion.Telefono = telefono;
            asociacion.Estatus = 1;
            asociacion.Descripcion = notas;
            asociacion.Distrito = "";
            asociacion.Seccion = "";
            asociacion.Campo1 = "";
            asociacion.Campo2 = 0;
            asociacion.Latitud = latitud;
            asociacion.Longitud = longitud;
            asociacion.FechaRegistro = DateTime.Now;
            asociacion.FechaUltimoCambio = DateTime.Now;
            asociacion.UsuarioRegistroId = 1;
            asociacion.DiputadoID = diputadoId;

            try
            {
                _context.Asociaciones.Add(asociacion);
                _context.SaveChanges();

                if (asociacion.AsociacionId != 0)
                {
                    return asociacion.AsociacionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la Asociación");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar una Asociaión: {0}", e.Message);
                return -1;
            }
        }



        /************************************************************
            ACTUALIZA Asociación
        *************************************************************/
        [HttpPost]
        public int ActualizaAsociacion(int asociacionId, string nombre, int coloniaId, int calleId, string numExterior, string numInterior, int cp, string email, string telefono, string latitud, string longitud, string notas)
        {
            int diputadoId = 8;
            if (Act_BuscaAsociacionXnombre(nombre, asociacionId) > 0)       //  Verifica que no exista otra ASOCIACÓN con el mismo nombre
            {
                return 0;
            }

            Asociacione asociacion = new Asociacione();
            asociacion.AsociacionId = asociacionId;
            asociacion.Nombre = nombre;
            asociacion.ColoniaId = coloniaId;
            asociacion.CalleId = calleId;
            asociacion.NumExterior = numExterior;
            asociacion.NumInterior = numInterior;
            asociacion.Cp = cp;
            asociacion.Email = email;
            asociacion.Telefono = telefono;
            asociacion.Estatus = 1;
            asociacion.Descripcion = notas;
            asociacion.Distrito = "";
            asociacion.Seccion = "";
            asociacion.Campo1 = "";
            asociacion.Campo2 = 0;
            asociacion.Latitud = latitud;
            asociacion.Longitud = longitud;
            asociacion.FechaRegistro = DateTime.Now;
            asociacion.FechaUltimoCambio = DateTime.Now;
            asociacion.UsuarioRegistroId = 1;
            asociacion.DiputadoID = diputadoId;

            try
            {
                _context.Asociaciones.Update(asociacion);
                _context.SaveChanges();

                if (asociacion.AsociacionId != 0)
                {
                    return asociacion.AsociacionId;
                }
                else
                {
                    Console.WriteLine("No se guardo en la BD la actualización Asociación");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al actualziar una Asociaión: {0}", e.Message);
                return -1;
            }
        }

        /*******************************************************************
            Busca si existe una Asociación con en el mismo Nombre
        ********************************************************************/
        public int BuscaAsociacionXnombre(string nombre)
        {
            var TotalRegistrosEncontrados = _context.Asociaciones.Where(a => a.Nombre == nombre).Count();
            return TotalRegistrosEncontrados;
        }

        /*******************************************************************
            ACTUALIZA : Busca si existe una Asociación con en el mismo Nombre
        ********************************************************************/
        public int Act_BuscaAsociacionXnombre(string nombre, int asociacionId)
        {
            var TotalRegistrosEncontrados = _context.Asociaciones.Where(a => a.Nombre == nombre && a.AsociacionId != asociacionId).Count();
            return TotalRegistrosEncontrados;
        }

        /************************************************************
            Obtiene Todas las ASOCIACIONES con Argumentos para WHERE
        *************************************************************/
        public IEnumerable<ObjetoAsociacion> ObtieneAsociaciones(int RegXpag, int offsetPeticiones, string Nombre, string Email, string Telefono, string Colonia, string Calle, int CP)
        {
            IEnumerable<ObjetoAsociacion> ListaObjetos = new List<ObjetoAsociacion>();
            ListaObjetos = (IEnumerable<ObjetoAsociacion>)(
                    from asociacion in _context.Asociaciones
                    join colonias in _context.Colonias on asociacion.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on asociacion.CalleId equals calles.CalleId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : asociacion.Nombre.Contains(Nombre)
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)
                    where true && (CP == 0) ? (true) : asociacion.Cp == CP
                    where true && String.IsNullOrEmpty(Email) ? (true) : asociacion.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : asociacion.Telefono.Contains(Telefono)

                    orderby asociacion.Nombre ascending

                    select new ObjetoAsociacion
                    {
                        AsociacionID = asociacion.AsociacionId,
                        Nombre = asociacion.Nombre ?? "",
                        //Presidente = _context.Ciudadanos.Where(c => c.Estatus==1 && _context.IntegrantesAsociacions.Where(ia => ia.Estatus==1 && ia.AsociacionId == asociacion.AsociacionId).Select(ai => ai.CiudadanoId).Contains(c.CiudadanoId)).Select(c => c.NombreCompleto).FirstOrDefault()??"",
                        Presidente = _context.Ciudadanos.Where(c => c.Estatus == 1 && (_context.IntegrantesAsociacions.Where(ia => ia.Estatus == 1 && ia.Representante == 1 && ia.AsociacionId == asociacion.AsociacionId).Select(ai => ai.CiudadanoId)).Contains(c.CiudadanoId)).Select(c => c.NombreCompleto).FirstOrDefault() ?? "",
                        Colonia = colonias.NombreColonia,
                        Calle = calles.NombreCalle,
                        ColoniaID = (int)asociacion.ColoniaId,
                        CalleID = (int)asociacion.CalleId,
                        CP = (int)asociacion.Cp,
                        NumeroExterior = asociacion.NumExterior ?? "",
                        NumeroInterior = asociacion.NumInterior ?? "",
                        Email = asociacion.Email ?? "",
                        Telefono = asociacion.Telefono ?? ""
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneAsociacionesXfiltro(string Nombre, string Email, string Telefono, string Colonia, string Calle, int CP)
        {
            var results =
                    from asociacion in _context.Asociaciones
                    join colonias in _context.Colonias on asociacion.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on asociacion.CalleId equals calles.CalleId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : asociacion.Nombre.Contains(Nombre)
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)
                    where true && (CP == 0) ? (true) : asociacion.Cp == CP
                    where true && String.IsNullOrEmpty(Email) ? (true) : asociacion.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : asociacion.Telefono.Contains(Telefono)

                    select asociacion.AsociacionId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Asociaciones
        ********************************************************************/
        public Int32 numeroAsociaciones()
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Asociaciones] WHERE Estatus = 1";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /****************************************************************************
            Obtiene Lista de Integrantes a una Asociación
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoIntegrantesAsoc> ObtieneListaIntegrantesAsociacion(int idAsociacion)
        {
            List<ObjetoIntegrantesAsoc> ListaObjetos = new List<ObjetoIntegrantesAsoc>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneIntegrantes_De_Asociacion";
            cmd.Parameters.Add("@AsociacionID", System.Data.SqlDbType.Int).Value = idAsociacion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoIntegrantesAsoc obj = new ObjetoIntegrantesAsoc();
                    obj.IntegrantesAsociacionID = query.GetInt32(0);
                    obj.CiudadanoID = query.GetInt32(1);
                    obj.AsociacionID = query.GetInt32(2);
                    obj.NombreCompleto = query.GetString(3);
                    obj.Puesto = query.GetString(4);
                    obj.Nota = query.GetString(5);
                    obj.Estatus = query.GetInt32(6);
                    obj.Representante = query.GetInt32(7);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        //        SELECT A.Nombre AS Asociacion, C.CiudadanoID, c.Nombre + ' ' + c.Paterno + ' ' + c.Materno AS Nombre, IA.Puesto, IA.Representante, c.telefono, c.email
        //FROM IntegrantesAsociacion AS IA
        //LEFT JOIN Asociaciones AS A ON A.AsociacionID = IA.AsociacionID
        //LEFT JOIN Ciudadanos as c on c.CiudadanoID = ia.CiudadanoID
        //Order BY A.Nombre, C.Nombre

        /********************************************************************
            Obtiene Integrantes de ASOCIACIONES con Argumentos para WHERE
        *********************************************************************/
        public IEnumerable<ObjetoIntegrantesAsoc> ObtieneIntegrantesAsociacion(int RegXpag, int offsetPeticiones, string Nombre, string Email, string Telefono, string Asociacion, string Puesto, int Representante)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoIntegrantesAsoc> ListaObjetos = new List<ObjetoIntegrantesAsoc>();
            ListaObjetos = (IEnumerable<ObjetoIntegrantesAsoc>)(
                    from integrantesAsociacion in _context.IntegrantesAsociacions
                    join asociaciones in _context.Asociaciones on integrantesAsociacion.AsociacionId equals asociaciones.AsociacionId 
                    join ciudadanos in _context.Ciudadanos on integrantesAsociacion.CiudadanoId equals ciudadanos.CiudadanoId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : ciudadanos.Nombre.Contains(Nombre)
                    where true && String.IsNullOrEmpty(Email) ? (true) : ciudadanos.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : ciudadanos.Telefono.Contains(Telefono)
                    where true && String.IsNullOrEmpty(Puesto) ? (true) : integrantesAsociacion.Puesto.Contains(Puesto)
                    where true && String.IsNullOrEmpty(Asociacion) ? (true) : asociaciones.Nombre.Contains(Asociacion)
                    where true && (Representante < 0) ? (true) : integrantesAsociacion.Representante == Representante
                    where asociaciones.DiputadoID == diputadoId

                    orderby asociaciones.Nombre, ciudadanos.Nombre 

                    select new ObjetoIntegrantesAsoc
                    {
                        AsociacionID = asociaciones.AsociacionId,
                        NombreAsociacion = asociaciones.Nombre??"",
                        CiudadanoID = ciudadanos.CiudadanoId,
                        NombreCompleto = ciudadanos.NombreCompleto??"",
                        Puesto = integrantesAsociacion.Puesto??"",
                        Representante = (int)integrantesAsociacion.Representante,
                        Telefono = ciudadanos.Telefono??"",
                        email = ciudadanos.Email??""
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Integrantes asociaciones aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroIntegrantesAsociacionesXfiltro(string Nombre, string Email, string Telefono, string Asociacion, string Puesto, int Representante)
        {
            var results =
                    from integrantesAsociacion in _context.IntegrantesAsociacions
                    join asociaciones in _context.Asociaciones on integrantesAsociacion.AsociacionId equals asociaciones.AsociacionId
                    join ciudadanos in _context.Ciudadanos on integrantesAsociacion.CiudadanoId equals ciudadanos.CiudadanoId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : ciudadanos.Nombre.Contains(Nombre)
                    where true && String.IsNullOrEmpty(Email) ? (true) : ciudadanos.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : ciudadanos.Telefono.Contains(Telefono)
                    where true && String.IsNullOrEmpty(Puesto) ? (true) : integrantesAsociacion.Puesto.Contains(Puesto)
                    where true && String.IsNullOrEmpty(Asociacion) ? (true) : asociaciones.Nombre.Contains(Asociacion)
                    where true && (Representante < 0) ? (true) : integrantesAsociacion.Representante == Representante

                    select integrantesAsociacion.IntegrantesAsociacionId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Integrantes de Asociaciones
        ********************************************************************/
        public Int32 numeroIntegrantesAsociaciones()
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[IntegrantesAsociacion] WHERE Estatus = 1";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Guarda Nuevo Integrante de Asociación
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevoIntegrante(int idAsociacion, int integranteId, string puesto, string notas, int cbRepresentante)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            puesto = puesto ?? "";
            notas = notas ?? "";

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaIntegranteAsociacion_Puesto";
            cmd.Parameters.Add("@AsociacionID", System.Data.SqlDbType.Int).Value = idAsociacion;
            cmd.Parameters.Add("@IntegranteID", System.Data.SqlDbType.Int).Value = integranteId;
            cmd.Parameters.Add("@Puesto", System.Data.SqlDbType.VarChar, 500).Value = puesto;
            cmd.Parameters.Add("@Notas", System.Data.SqlDbType.VarChar, 3000).Value = notas;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@Representante", System.Data.SqlDbType.Int).Value = cbRepresentante;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        
        /****************************************************************************
            Actualiza Integrante de Asociación
        *****************************************************************************/
        [HttpPost]
        public int ActualizaIntegrante(int integrantesAsociacionId, int idAsociacion, int integranteId, string puesto, string notas, int cbRepresentante)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            puesto = puesto ?? "";
            notas = notas ?? "";

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpActualizaIntegranteAsociacion_Puesto";
            cmd.Parameters.Add("@AsociacionID", System.Data.SqlDbType.Int).Value = idAsociacion;
            cmd.Parameters.Add("@IntegranteAsociacionID", System.Data.SqlDbType.Int).Value = integrantesAsociacionId;
            cmd.Parameters.Add("@IntegranteID", System.Data.SqlDbType.Int).Value = integranteId;
            cmd.Parameters.Add("@Puesto", System.Data.SqlDbType.VarChar, 500).Value = puesto;
            cmd.Parameters.Add("@Notas", System.Data.SqlDbType.VarChar, 3000).Value = notas;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@Representante", System.Data.SqlDbType.Int).Value = cbRepresentante;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /************************************************************
            Obtiene Detalle de una ASOCIACIÓN
        *************************************************************/
        public IEnumerable<ObjetoAsociacion> ObtieneDetalleAsociacion(int idAsociacion)
        {
            IEnumerable<ObjetoAsociacion> ListaObjetos = new List<ObjetoAsociacion>();
            ListaObjetos = (IEnumerable<ObjetoAsociacion>)(
                    from asociaciones in _context.Asociaciones.Where(aso => aso.AsociacionId == idAsociacion)
                    join colonia in _context.Colonias on asociaciones.ColoniaId equals colonia.ColoniaId
                    join calle in _context.Calles on asociaciones.CalleId equals calle.CalleId
                    select new ObjetoAsociacion
                    {
                        AsociacionID = asociaciones.AsociacionId,
                        Nombre = asociaciones.Nombre,
                        Presidente = _context.Ciudadanos.Where(c => c.Estatus == 1 && (_context.IntegrantesAsociacions.Where(ia => ia.Estatus == 1 && ia.Representante==1 && ia.AsociacionId == asociaciones.AsociacionId).Select(ai => ai.CiudadanoId)).Contains(c.CiudadanoId) ).Select(c => c.NombreCompleto).FirstOrDefault() ?? "",
                        //Presidente = _context.Ciudadanos.Where(c => c.Estatus == 1 && c.CiudadanoId.Equals(_context.IntegrantesAsociacions.Where(ia => ia.Estatus == 1 && ia.AsociacionId == asociaciones.AsociacionId && ia.Representante == 1).Select(ai => ai.CiudadanoId).First())).Select(c => c.NombreCompleto).FirstOrDefault()??"",
                        Colonia = colonia.NombreColonia ?? "",
                        Calle = calle.NombreCalle ?? "",
                        ColoniaID = (int)asociaciones.ColoniaId,
                        CalleID = (int)asociaciones.CalleId,
                        NumeroExterior = asociaciones.NumExterior ?? "",
                        NumeroInterior = asociaciones.NumInterior ?? "",
                        CP = (int)asociaciones.Cp,
                        Email = asociaciones.Email ?? "",
                        Telefono = asociaciones.Telefono ?? "",
                        Notas = asociaciones.Descripcion ?? ""
                    });
            return ListaObjetos;
        }


        /********************
         *  OBJETOS
         ********************/
        public partial class ObjetoIntegrantesAsoc
        {
            public int IntegrantesAsociacionID { get; set; }
            public int CiudadanoID { get; set; }
            public int AsociacionID { get; set; }
            public string NombreCompleto { get; set; }
            public string Puesto { get; set; }
            public string Nota { get; set; }
            public int Estatus { get; set; }
            public int Representante { get; set; }
            public string Telefono { get; set; }
            public string email { get; set; }
            public string NombreAsociacion { get; set; }
        }
    }
}

